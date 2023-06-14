import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleService, useStyleSheet } from "@ui-kitten/components";
import { TouchableNativeFeedback, View } from "react-native";

interface IFloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: IFloatingActionButtonProps) {
  const styles = useStyleSheet(fabStyles);
  return (
    <View style={styles.fabContainer}>
      <TouchableNativeFeedback
        style={styles.fabButtonContainer}
        onPress={() => onClick?.()}
      >
        <View style={styles.fab}>
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
  fab: {
    width: 48,
    height: 48,
    borderRadiues: 9999,
    padding: 8,
    backgroundColor: "cta",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
