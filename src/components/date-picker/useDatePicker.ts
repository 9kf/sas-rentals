import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";

interface IUseDatePickerProps {
  defaultDate?: Date;
  onConfirmCallback?: (date: Date) => void;
}

export function useDatePicker(props?: IUseDatePickerProps) {
  const [open, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (props?.defaultDate) {
      setDate(props.defaultDate);
    }
  }, []);

  function onChange(event: DateTimePickerEvent, date?: Date | undefined) {
    setIsOpen(false);

    if (event.type === "set" && date != undefined) {
      setDate(date);
      props?.onConfirmCallback?.(date);
    }
  }

  function toggle(open?: boolean) {
    if (open !== undefined) {
      setIsOpen(open);
      return;
    }

    setIsOpen(!open);
  }

  return {
    open,
    date,
    toggle,
    onChange,
  };
}
