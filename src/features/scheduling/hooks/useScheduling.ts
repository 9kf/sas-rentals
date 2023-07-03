import { getYear, startOfMonth, setDay, nextMonday } from "date-fns";

export function useScheduling() {
  const thisYear = getYear(new Date());

  function getStructuredDates(year: number) {
    let dateObj = {};

    Array.from(Array(12).keys()).forEach((val) => {
      const monthStart = startOfMonth(new Date(thisYear, val));
      const firstMonday = setDay(monthStart, 2);
      const nextWeek = nextMonday(firstMonday);

      dateObj = { ...dateObj, [val]: {} };
    });
    // console.log(startOfMonth(new Date(thisYear, 0)))
  }

  return {
    states: {
      thisYear,
    },
    functions: {
      getStructuredDates,
    },
  };
}
