import { Pressable, TextInput, View } from "react-native";
import DatePicker, { DatePickerProps } from "react-native-date-picker";
import format from "date-fns/format";

interface IDatePickerWrapperProps extends DatePickerProps {
  dateFormat?: string;
  toggle?: (open?: boolean) => void;
}

export function DatePickerWrapper({
  dateFormat,
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
          value={format(datePickerProps.date, textInputDateFormat)}
        />
      </Pressable>

      <DatePicker modal mode="date" {...datePickerProps} />
    </View>
  );
}
