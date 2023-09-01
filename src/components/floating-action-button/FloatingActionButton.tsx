import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleService, useStyleSheet } from "@ui-kitten/components";
import { TouchableNativeFeedback, View } from "react-native";
import useTheme from "../../theme/useTheme";

interface IFloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: IFloatingActionButtonProps) {
  const styles = useStyleSheet(fabStyles);
  const { buttonStyles } = useTheme();
  return (
    <View style={styles.fabContainer}>
      <TouchableNativeFeedback
        style={styles.fabButtonContainer}
        onPress={() => onClick?.()}
      >
        <View style={buttonStyles.fab}>
          <MaterialCommunityIcon name="plus" color="white" size={32} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const fabStyles = StyleService.create({
  fabContainer: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    overflow: "hidden",
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fabButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
});
