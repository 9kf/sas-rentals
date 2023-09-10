import { zodResolver } from "@hookform/resolvers/zod";
import firestore from "@react-native-firebase/firestore";
import format from "date-fns/format";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import isAfter from "date-fns/isAfter";
import isSameDay from "date-fns/isSameDay";
import { z } from "zod";
import { useState } from "react";

import { useRentalSchedulingService } from "../service";
import { IRentalScheduleFirebaseResponse } from "../types";
import { getDatesInRange } from "../helpers";
import { IRepeatRentalModalProps } from "../../../screens/modals/RepeatRentalModal";
import { useToast } from "../../../components";
import { useNotificationService } from "../../notifications";

const repeatRentalFormSchema = z.object({
  startDate: z.string().min(1, { message: "Field is requried" }),
  endDate: z.string().min(1, { message: "Field is requried" }),
});

export type TRpeatRentalFormSchema = z.infer<typeof repeatRentalFormSchema>;

const DATE_FORMAT = "yyyy-MM-dd";

export function useRepeatRentalModal({
  navigation,
  route,
}: IRepeatRentalModalProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset,
  } = useForm<TRpeatRentalFormSchema>({
    resolver: zodResolver(repeatRentalFormSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { field: startDate } = useController({
    control,
    defaultValue: format(new Date(), DATE_FORMAT),
    name: "startDate",
  });

  const { field: endDate } = useController({
    control,
    defaultValue: format(new Date(), DATE_FORMAT),
    name: "endDate",
  });

  const { rentalScheduleDocument, repeatRental } = useRentalSchedulingService();
  const {
    scheduleDeliveryNotification,
    scheduleReturnNotification,
    schedulePaymentNotification,
    scheduleLatePaymentNotification,
  } = useNotificationService();

  const showToast = useToast((state) => state.showToast);

  function onChangeStartDate(date: Date) {
    setValue("startDate", format(date, DATE_FORMAT));

    validateRentalDates();
  }

  function onChangeEndDate(date: Date) {
    setValue("endDate", format(date, DATE_FORMAT));

    validateRentalDates();
  }

  async function validateRentalDates() {
    clearErrors("startDate");

    const { startDate, endDate } = getValues();

    if (startDate !== "" && endDate !== "") {
      const rentalDocs = await rentalScheduleDocument
        .where("asset.id", "==", route.params.rentalDetails.asset.id)
        .get();

      for (const doc of rentalDocs.docs) {
        const typedData = doc.data() as IRentalScheduleFirebaseResponse;

        const docDatesInRange = getDatesInRange(
          typedData.startDate.toDate(),
          typedData.endDate.toDate()
        ).map((date) => format(date, "yyyy-MM-dd"));

        const rentalDatesInRange = getDatesInRange(
          new Date(startDate),
          new Date(endDate)
        ).map((date) => format(date, "yyyy-MM-dd"));

        const isOverlapping = docDatesInRange.some(
          (r) => rentalDatesInRange.indexOf(r) >= 0
        );

        if (isOverlapping) {
          setError("startDate", {
            message: "The asset has an overlapping date of rental.",
          });
          break;
        }
      }
    }
  }

  const setRental: SubmitHandler<TRpeatRentalFormSchema> = (data) => {
    setIsSubmitting(true);

    const rentalDetails = route.params.rentalDetails;

    const payload = {
      ...rentalDetails,
      startDate: firestore.Timestamp.fromDate(new Date(data.startDate)),
      endDate: firestore.Timestamp.fromDate(new Date(data.endDate)),
    };

    repeatRental(
      payload,
      () => {
        showToast({
          title: "Success",
          message: "Rental Schedule has been set",
          type: "success",
        });
        setIsSubmitting(false);
        navigation.navigate("schedules");

        if (isAfter(new Date(data.startDate), new Date())) {
          // delivery notification
          scheduleDeliveryNotification({
            assetId: rentalDetails.asset.id,
            assetName: rentalDetails.asset.name,
            customerName: rentalDetails.customer.name,
            targetDate: new Date(data.startDate),
          });
        }

        if (
          isAfter(new Date(data.endDate), new Date()) &&
          !isSameDay(new Date(data.startDate), new Date(data.endDate))
        ) {
          // return notification
          scheduleReturnNotification({
            assetId: rentalDetails.asset.id,
            assetName: rentalDetails.asset.name,
            customerName: rentalDetails.customer.name,
            targetDate: new Date(data.endDate),
          });

          // payment notification
          schedulePaymentNotification({
            assetId: rentalDetails.asset.id,
            assetName: rentalDetails.asset.name,
            customerName: rentalDetails.customer.name,
            targetDate: new Date(data.endDate),
          });
        }
      },
      (error) => {
        showToast({ title: "Error", message: error, type: "error" });
        setIsSubmitting(false);
      }
    );
  };

  return {
    startDate,
    endDate,
    errors,
    isSubmitting,
    handleSubmit,
    setRental,
    onChangeStartDate,
    onChangeEndDate,
  };
}
