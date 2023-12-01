import { Pressable, TextInput, View } from "react-native";
import format from "date-fns/format";
import DateTimePicker, {
  DatePickerOptions,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface IDatePickerWrapperProps extends DatePickerOptions {
  dateFormat?: string;
  toggle?: (open?: boolean) => void;
  open: boolean;
  onChange: (event: DateTimePickerEvent, date?: Date | undefined) => void;
}

export function DatePickerWrapper({
  dateFormat,
  open,
  toggle,
  ...datePickerProps
}: IDatePickerWrapperProps) {
  const textInputDateFormat = dateFormat ?? "MMMM dd, yyyy";

  return (
    <View>
      <Pressable onPress={() => toggle?.(true)}>
        <TextInput
          style={{ zIndex: 1, color: "black" }}
          editable={false}
          value={format(datePickerProps.value, textInputDateFormat)}
        />
      </Pressable>

      {open ? <DateTimePicker mode="date" {...datePickerProps} /> : null}
    </View>
  );
}
