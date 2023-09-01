import { useState } from "react";
import { CalendarRange } from "@ui-kitten/components";

interface IUseRangeDatePicker {
  onSelectDateRange: (range: CalendarRange<Date>) => void;
  min?: Date;
  max?: Date;
}

export function useRangeDatePicker(props?: IUseRangeDatePicker) {
  const [range, setRange] = useState<CalendarRange<Date>>({});

  function onSelect(range: CalendarRange<Date>) {
    setRange(range);
    props?.onSelectDateRange?.(range);
  }

  return {
    states: {
      range,
      min: props?.min,
      max: props?.max,
    },
    functions: {
      onSelect,
    },
  };
}
