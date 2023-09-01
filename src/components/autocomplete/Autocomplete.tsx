import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
import useTheme from "../../theme/useTheme";
import { IOption } from "../../utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";

interface IAutocompleteProps<T extends IOption> {
  value?: string;
  onChangeText?: (newText: string) => void;
  options?: T[];
  shownOptions?: T[];
  searchText: (newText: string) => void;
  onSelect: (optionId: string) => void;
  toggle: (open: boolean | undefined) => void;
  isCollapsed: boolean;
  optionsContainerMaxHeight?: number;
}

function Option<T extends IOption>({
  item,
  onSelect,
}: {
  item: T;
  onSelect: (optionId: string) => void;
}) {
  return (
    <TouchableNativeFeedback onPress={() => onSelect(item.id)}>
      <View>
        <Text style={{ margin: 8, textTransform: "capitalize" }}>
          {item.name}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
}

export function AutoComplete<T extends IOption>({
  value,
  onChangeText,
  isCollapsed,
  onSelect,
  toggle,
  options,
  shownOptions,
  searchText,
  optionsContainerMaxHeight,
}: IAutocompleteProps<T>) {
  const { inputStyles } = useTheme();
  const blurTimeoutRef = useRef<any>(null);

  const handleOnChangeText = (text: string) => {
    onChangeText?.(text);
    searchText(text);
  };

  return (
    <View
      style={{
        position: "relative",
      }}
    >
      {!isCollapsed && (
        <SafeAreaView
          style={{
            ...styles.optionsContainer,
            ...(optionsContainerMaxHeight && {
              maxHeight: optionsContainerMaxHeight,
            }),
          }}
        >
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={shownOptions}
            renderItem={({ item }) => (
              <Option item={item} onSelect={onSelect} />
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      )}

      <TextInput
        style={inputStyles.textInput}
        value={value}
        onChangeText={handleOnChangeText}
        onBlur={() => toggle(true)}
        onFocus={() => toggle(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    position: "absolute",
    marginTop: 48,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: "white",
    zIndex: 9999,
    width: "100%",
    elevation: 8,
  },
});
