import { useState } from "react";
import { CalendarRange } from "@ui-kitten/components";

export function useRangeDatePicker() {
  const [range, setRange] = useState({});

  function onSelect(range: CalendarRange<Date>) {
    setRange(range);
  }

  return {
    states: {
      range,
    },
    functions: {
      onSelect,
    },
  };
}
