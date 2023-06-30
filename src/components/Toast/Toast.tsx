import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";

import useTheme from "../../theme/useTheme";
import { useToast } from "./useToast";

export function Toast() {
  const { containerStyles, textStyles } = useTheme();
  const visible = useToast((state) => state.isOpen);
  const type = useToast((state) => state.type);
  const title = useToast((state) => state.title);
  const message = useToast((state) => state.message);
  const closeToast = useToast((state) => state.closeToast);

  return (
    <View
      style={{
        ...containerStyles.toastLayoutContainer,
        display: visible ? "flex" : "none",
      }}
    >
      <View
        style={{
          ...containerStyles.toastContainer,
          ...(type === "success" ? styles.successToast : styles.errorToast),
        }}
      >
        <View style={{ marginBottom: 4, flexDirection: "row" }}>
          <Text style={{ ...textStyles.toastTitle, flexGrow: 1 }}>{title}</Text>
          <TouchableNativeFeedback onPress={closeToast}>
            <MaterialDesignIcons name="close" color="white" size={16} />
          </TouchableNativeFeedback>
        </View>
        <Text style={textStyles.toastMessage}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  successToast: {
    backgroundColor: "#408140",
  },
  errorToast: {
    backgroundColor: "#ff3333",
  },
});
