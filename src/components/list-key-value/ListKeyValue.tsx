import {
  ControllerRenderProps,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import {
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  TextInput,
} from "react-native";
import { ListKeyValueSchemaType } from "./useListKeyValue";
import useTheme from "../../theme/useTheme";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

export interface IListKeyValueProps {
  namePlaceholder?: string;
  valuePlaceholder?: string;
  values: ListKeyValueSchemaType[];
  name: ControllerRenderProps<ListKeyValueSchemaType, "name">;
  value: ControllerRenderProps<ListKeyValueSchemaType, "value">;
  isValid: boolean;
  errors: FieldErrors<ListKeyValueSchemaType>;
  addValue: SubmitHandler<ListKeyValueSchemaType>;
  handleSubmit: UseFormHandleSubmit<ListKeyValueSchemaType, undefined>;
  removeValue: (index: number) => void;
  emptyPlaceholder?: string;
}

const ADD_BUTTON_WIDTH_HEIGHT = 32;
const REMOVE_BUTTON_WIDTH_HEIGHT = 30;

export default function ListKeyValue({
  namePlaceholder,
  valuePlaceholder,
  values,
  name,
  value,
  errors,
  isValid,
  addValue,
  handleSubmit,
  removeValue,
  emptyPlaceholder,
}: IListKeyValueProps) {
  const { buttonStyles, inputStyles, textStyles, containerStyles } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      {values.length > 0 ? (
        values.map((val, index) => (
          <View key={index} style={containerStyles.itemContainer}>
            <TouchableNativeFeedback
              style={styles.btnContainer}
              onPress={() => removeValue(index)}
            >
              <View
                style={{
                  ...buttonStyles.fab,
                  backgroundColor: "red",
                  marginLeft: 4,
                  marginRight: 8,
                  width: REMOVE_BUTTON_WIDTH_HEIGHT,
                  height: REMOVE_BUTTON_WIDTH_HEIGHT,
                }}
              >
                <MaterialCommunityIcon name="minus" color="white" size={8} />
              </View>
            </TouchableNativeFeedback>
            <View
              style={{
                flexDirection: "row",
                marginTop: 2,
                borderBottomWidth: 1,
              }}
            >
              <Text style={textStyles.normalText}>{val.name}: </Text>
              <Text style={textStyles.normalText}>{val.value}</Text>
            </View>
          </View>
        ))
      ) : (
        <View>
          <Text>{emptyPlaceholder ? emptyPlaceholder : "No Items"}</Text>
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TouchableNativeFeedback
          style={styles.btnContainer}
          onPress={handleSubmit(addValue)}
          disabled={!isValid}
        >
          <View
            style={{
              ...buttonStyles.fab,
              ...(!isValid && { backgroundColor: "lightgray" }),
              marginHorizontal: 4,
              width: ADD_BUTTON_WIDTH_HEIGHT,
              height: ADD_BUTTON_WIDTH_HEIGHT,
            }}
          >
            <MaterialCommunityIcon name="plus" color="white" size={16} />
          </View>
        </TouchableNativeFeedback>
        <TextInput
          style={{ ...inputStyles.textInput, flexBasis: "52%" }}
          value={name.value}
          onChangeText={name.onChange}
          inputMode="text"
          placeholder={namePlaceholder || ""}
        />
        <TextInput
          style={{ ...inputStyles.textInput, flexBasis: "32%" }}
          value={value.value}
          onChangeText={value.onChange}
          inputMode="numeric"
          placeholder={valuePlaceholder || ""}
        />
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
