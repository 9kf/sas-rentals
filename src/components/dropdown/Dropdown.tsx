import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableNativeFeedback,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { IOption } from "../../utils/types";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import useTheme from "../../theme/useTheme";

interface IDropdownProps extends TextInputProps {
  options: IOption[];
  getSelectedOption: () => IOption | undefined;
  onSelect: (optionId: string) => void;
  toggle: (open: boolean | undefined) => void;
  isCollapsed: boolean;
  optionsContainerMaxHeight?: number;
}

const Option = ({
  item,
  isActive,
  onSelect,
}: {
  item: IOption;
  isActive: boolean;
  onSelect: (optionId: string) => void;
}) => {
  return (
    <TouchableNativeFeedback onPress={() => onSelect(item.id)}>
      <View style={{ ...(isActive && { backgroundColor: "lightgray" }) }}>
        <Text style={{ margin: 8, textTransform: "capitalize" }}>
          {item.name}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export default function Dropdown({
  options,
  isCollapsed,
  optionsContainerMaxHeight,
  getSelectedOption,
  onSelect,
  toggle,
}: IDropdownProps) {
  const { inputStyles } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => toggle(undefined)}>
        <View style={inputStyles.dropdownInput}>
          <Text style={{ ...styles.fullWidth, textTransform: "capitalize" }}>
            {getSelectedOption()?.name ?? ""}
          </Text>
          <MaterialCommunityIcons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={24}
          />
        </View>
      </TouchableWithoutFeedback>

      {!isCollapsed && (
        <SafeAreaView
          style={{
            ...(styles.optionsContainer as object),
            ...(optionsContainerMaxHeight && {
              maxHeight: optionsContainerMaxHeight,
            }),
          }}
        >
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <Option
                item={item}
                onSelect={onSelect}
                isActive={getSelectedOption()?.id === item.id}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9999,
  },
  fullWidth: {
    flexGrow: 1,
  },
  optionsContainer: {
    position: "absolute",
    marginTop: 48,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: "white",
    zIndex: 50,
    width: "100%",
    elevation: 8,
  },
});
