import { useCallback, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import subMonths from "date-fns/subMonths";
import addMonths from "date-fns/addMonths";
import format from "date-fns/format";
import { DateData } from "react-native-calendars";

import { getDatesInRange } from "../helpers";
import { IRentalScheduleFirebaseResponse } from "../types";
import { useRentalSchedulingService } from "../service";
import { ISchedulingProps } from "../../../screens/scheduling/Scheduling";
import { useFocusEffect } from "@react-navigation/native";

interface IMarkedDates {
  [key: string]: {
    periods: { startingDay: boolean; endingDay: boolean; color: string }[];
  };
}

export function useScheduling({ navigation, route }: ISchedulingProps) {
  const { rentalScheduleDocument } = useRentalSchedulingService();

  const [markedDates, setMarkedDates] = useState<IMarkedDates>({});
  const [rentals, setRentals] = useState<IRentalScheduleFirebaseResponse[]>([]);

  const getRentalsForMonth = async (monthDate?: Date) => {
    const currentMonth = monthDate ?? new Date();

    const start = startOfMonth(subMonths(currentMonth, 1));
    const end = endOfMonth(addMonths(currentMonth, 1));

    const rentalsCopy = [];
    setRentals([]);

    const thisMonthRentals = await rentalScheduleDocument
      .orderBy("startDate")
      .orderBy("endDate")
      .startAt(firestore.Timestamp.fromDate(new Date(start)))
      .endAt(firestore.Timestamp.fromDate(new Date(end)))
      .get();

    let markedDatesCopy = {} as IMarkedDates;

    for (const doc of thisMonthRentals.docs) {
      const typedData = doc.data() as IRentalScheduleFirebaseResponse;
      if (typedData.startDate.toDate().getMonth() === currentMonth.getMonth())
        rentalsCopy.push({ ...typedData, id: doc.id });

      const datesInRange = getDatesInRange(
        typedData.startDate.toDate(),
        typedData.endDate.toDate()
      ).map((date) => format(date, "yyyy-MM-dd"));

      datesInRange.forEach((date, index) => {
        markedDatesCopy[format(new Date(date), "yyyy-MM-dd")] = {
          periods: [
            ...(markedDatesCopy[format(new Date(date), "yyyy-MM-dd")]
              ?.periods || []),
            {
              startingDay: index === 0 ? true : false,
              endingDay: index === datesInRange.length - 1 ? true : false,
              color: typedData?.asset?.color ?? "",
            },
          ],
        };
      });
    }

    setRentals(rentalsCopy);
    setMarkedDates(markedDatesCopy);
  };

  useFocusEffect(
    useCallback(() => {
      getRentalsForMonth();
    }, [navigation])
  );

  const onMonthChange = (date: DateData) => {
    getRentalsForMonth(new Date(date.year, date.month - 1));
  };

  return {
    states: {
      markedDates,
      rentals,
    },
    functions: {
      onMonthChange,
    },
  };
}
