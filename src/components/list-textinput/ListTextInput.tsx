import {
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  View,
  Text,
} from "react-native";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "../../theme/useTheme";
import {
  ControllerRenderProps,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";

export interface IListTextInputProps<T> {
  values: T[];
  newValue: ControllerRenderProps<
    {
      newValue: string;
    },
    "newValue"
  >;
  isValid: boolean;
  errors: FieldErrors<{ newValue: T }>;
  addValue: SubmitHandler<{
    newValue: T;
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      newValue: T;
    },
    undefined
  >;
  removeValue: (index: number) => void;
}

const ADD_BUTTON_WIDTH_HEIGHT = 32;
const REMOVE_BUTTON_WIDTH_HEIGHT = 24;

export default function ListTextInput<T>({
  values,
  errors,
  isValid,
  newValue,
  addValue,
  removeValue,
  handleSubmit,
}: IListTextInputProps<T>) {
  const { buttonStyles, inputStyles, textStyles } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      {values.map((val, index) => (
        <View
          key={index}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <TouchableNativeFeedback
            style={styles.btnContainer}
            onPress={() => removeValue(index)}
          >
            <View
              style={{
                ...buttonStyles.fab,
                backgroundColor: "red",
                padding: 4,
                width: REMOVE_BUTTON_WIDTH_HEIGHT,
                height: REMOVE_BUTTON_WIDTH_HEIGHT,
              }}
            >
              <MaterialCommunityIcon name="minus" color="white" size={12} />
            </View>
          </TouchableNativeFeedback>
          <Text style={{ ...textStyles.normalText, marginTop: 2 }}>
            {val as string}
          </Text>
        </View>
      ))}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{ ...inputStyles.textInput, flexBasis: "88%" }}
          value={newValue.value}
          onChangeText={newValue.onChange}
          inputMode="numeric"
        />
        <View style={{ flexGrow: 1 }} />
        <TouchableNativeFeedback
          style={styles.btnContainer}
          onPress={handleSubmit(addValue)}
          disabled={!isValid}
        >
          <View
            style={{
              ...buttonStyles.fab,
              ...(!isValid && { backgroundColor: "lightgray" }),
              width: ADD_BUTTON_WIDTH_HEIGHT,
              height: ADD_BUTTON_WIDTH_HEIGHT,
            }}
          >
            <MaterialCommunityIcon name="plus" color="white" size={16} />
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    height: ADD_BUTTON_WIDTH_HEIGHT,
    width: ADD_BUTTON_WIDTH_HEIGHT,
    borderRadius: 9999,
  },
});
