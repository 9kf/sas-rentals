import { useEffect, useState } from "react";

interface IUseDatePickerProps {
  defaultDate?: Date;
  onConfirmCallback?: (date: Date) => void;
  onCloseCallback?: () => void;
  onCancelCallback?: () => void;
}

export function useDatePicker(props?: IUseDatePickerProps) {
  const [open, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (props?.defaultDate) {
      setDate(props.defaultDate);
    }
  }, []);

  function onConfirm(date: Date) {
    setIsOpen(false);
    setDate(date);
    props?.onConfirmCallback?.(date);
  }

  function onClose() {
    setIsOpen(false);
    props?.onCloseCallback?.();
  }

  function toggle(open?: boolean) {
    if (open !== undefined) {
      setIsOpen(open);
      return;
    }

    setIsOpen(!open);
  }

  function onCancel() {
    setIsOpen(false);
    props?.onCancelCallback?.();
  }

  return {
    open,
    date,
    onConfirm,
    onClose,
    toggle,
    onCancel,
  };
}
