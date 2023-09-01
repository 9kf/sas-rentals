import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInBusinessDays from "date-fns/differenceInBusinessDays";
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import addWeeks from "date-fns/addWeeks";
import isSameMonth from "date-fns/isSameMonth";
import addDays from "date-fns/addDays";
import { DateRanges, MonthData } from "./types";

export function getDifferenceExcludingSundays(
  includeSundays: boolean,
  startDate: Date,
  endDate: Date
) {
  return includeSundays
    ? differenceInCalendarDays(endDate, startDate) + 1
    : differenceInBusinessDays(endDate, startDate) + 1;
}

export function calculateExpectedPayment(
  rateIntervalId: string,
  includeSundays: boolean,
  startDate: Date,
  endDate: Date,
  dailyRate: number,
  weeklyRate: number,
  monthlyRate: number,
  yearlyRate: number,
  mobilizationFee: number
) {
  /**
   * Calculate expected payment for the rental schedule
   * 1 - daily
   * 2 - weekly
   * 3 - monthly
   * 4 - yearly
   */

  let expectedPayment = 0;
  if (rateIntervalId === "1") {
    expectedPayment =
      getDifferenceExcludingSundays(includeSundays, startDate, endDate) *
      dailyRate;
  } else if (rateIntervalId === "2") {
    const numberOfWeeks = parseInt(
      (
        getDifferenceExcludingSundays(includeSundays, startDate, endDate) / 7
      ).toFixed(0)
    );
    const extraDays =
      getDifferenceExcludingSundays(includeSundays, startDate, endDate) % 7;
    expectedPayment = numberOfWeeks * weeklyRate + extraDays * dailyRate;
  } else if (rateIntervalId === "3") {
    const numberOfMonths = parseInt(
      (
        getDifferenceExcludingSundays(includeSundays, startDate, endDate) / 30
      ).toFixed(0)
    );
    const extraDays =
      getDifferenceExcludingSundays(includeSundays, startDate, endDate) % 30;
    expectedPayment = numberOfMonths * monthlyRate + extraDays * dailyRate;
  } else if (rateIntervalId === "4") {
    const numberOfYears = parseInt(
      (
        getDifferenceExcludingSundays(includeSundays, startDate, endDate) / 365
      ).toFixed(0)
    );
    const extraDays =
      getDifferenceExcludingSundays(includeSundays, startDate, endDate) % 365;
    expectedPayment = numberOfYears * yearlyRate + extraDays * dailyRate;
  }

  return expectedPayment + mobilizationFee;
}

export function generateDateRanges(year: number): DateRanges {
  const result: DateRanges = {};

  for (let month = 0; month < 12; month++) {
    const monthNumber: string = format(new Date(year, month), "M");
    const monthData: MonthData = {};

    let currentDate: Date = startOfMonth(new Date(year, month));
    let week = 1;

    while (isSameMonth(currentDate, new Date(year, month))) {
      const startDate: Date = startOfWeek(currentDate);
      const endDate: Date = endOfWeek(currentDate);

      if (!isSameMonth(startDate, currentDate)) {
        // If the start of the week is in the previous month,
        // move the current date to the next day
        currentDate = addDays(currentDate, 1);
        continue; // Skip adding this week to the monthData and repeat the loop
      }

      monthData[week] = {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      };

      currentDate = addWeeks(currentDate, 1);
      week++;
    }

    result[monthNumber] = monthData;
  }

  return result;
}

export function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const datesInRange: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    datesInRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesInRange;
}
