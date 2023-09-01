import { CalendarRange } from "@ui-kitten/components";
import { useState } from "react";

export function useRangeCalendar() {
  const [range, setRange] = useState({});

  return {
    states: {
      range,
    },
    functions: {
      setRange,
    },
  };
}
