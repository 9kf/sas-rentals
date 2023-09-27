import { Text, TouchableNativeFeedback, View } from "react-native";
import auth from "@react-native-firebase/auth";

import useTheme from "../../theme/useTheme";
import { useAuth } from "../../features/auth";

export default function Settings() {
  const { containerStyles, buttonStyles, textStyles } = useTheme();
  const user = useAuth((state) => state.user);

  function onPressSignout() {
    auth().signOut();
  }

  return (
    <View style={containerStyles.defaultPageStyle}>
      <View style={{ ...containerStyles.rowCenterAlign, marginBottom: 24 }}>
        <View
          style={{
            borderRadius: 9999,
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginRight: 16,
            backgroundColor: "#EC9110",
          }}
        >
          <Text
            style={{
              ...textStyles.title,
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {user?.displayName
              ? user?.displayName
                  ?.split(" ")
                  .map((name) => name[0])
                  .join()
                  .replaceAll(",", "")
              : user?.email
                  ?.split("@")
                  .map((name) => name[0])
                  .join()
                  .replaceAll(",", "")}
          </Text>
        </View>
        <View>
          <Text>{user?.displayName}</Text>
          <Text>{user?.email}</Text>
        </View>
      </View>
      <TouchableNativeFeedback onPress={onPressSignout}>
        <View style={{ ...buttonStyles.destructive, padding: 8 }}>
          <Text style={{ ...textStyles.buttonText, textTransform: "none" }}>
            Sign out
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
