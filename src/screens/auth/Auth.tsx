import { Text, View } from "react-native";
import useTheme from "../../theme/useTheme";
import AntDesignIcons from "@expo/vector-icons/AntDesign";
import { useAuth } from "../../features/auth";

export default function Auth() {
  const { containerStyles, textStyles, buttonStyles } = useTheme();
  const onGoogleButtonPress = useAuth((state) => state.onGoogleLinkButtonPress);

  return (
    <View
      style={{
        ...containerStyles.defaultPageStyle,
        ...containerStyles.centerAll,
      }}
    >
      <Text style={{ ...textStyles.title, color: "#EC9110", marginBottom: 60 }}>
        SAS RENTALS
      </Text>
      <AntDesignIcons.Button name="google" onPress={onGoogleButtonPress}>
        <Text
          style={{
            ...textStyles.buttonText,
            textTransform: "none",
          }}
        >
          Sign in with Google
        </Text>
      </AntDesignIcons.Button>
    </View>
  );
}
