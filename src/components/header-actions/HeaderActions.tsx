import { TouchableOpacity, View } from "react-native";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "../../theme/useTheme";

export interface IHeaderActionsProps {
  onPressEdit?: () => void;
  onPressDelete?: () => void;
  onPressRepeat?: () => void;
}

export function HeaderActions({
  onPressDelete,
  onPressEdit,
  onPressRepeat,
}: IHeaderActionsProps) {
  const { containerStyles } = useTheme();
  return (
    <View
      style={{ ...containerStyles.rowCenterAlign, gap: 8, paddingRight: 16 }}
    >
      {onPressEdit && (
        <TouchableOpacity onPress={onPressEdit}>
          <MaterialDesignIcons name="pencil" color={"#EC9110"} size={20} />
        </TouchableOpacity>
      )}
      {onPressDelete && (
        <TouchableOpacity onPress={onPressDelete}>
          <MaterialDesignIcons name="delete" color={"red"} size={20} />
        </TouchableOpacity>
      )}
      {onPressRepeat && (
        <TouchableOpacity onPress={onPressRepeat}>
          <MaterialDesignIcons name="repeat" color={"#EC9110"} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}
