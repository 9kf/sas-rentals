import { Text, View, Image, Dimensions } from "react-native";
import useTheme from "../../theme/useTheme";
import AntDesignIcons from "@expo/vector-icons/AntDesign";
import { useAuth } from "../../features/auth";

const LOGO = require("../../assets/imgs/bgless_icon.png");
const logoHeight = Dimensions.get("screen").height * 0.4;
const logoWidth = Dimensions.get("screen").width * 0.4;

export default function Auth() {
  const { containerStyles, textStyles } = useTheme();
  const onGoogleButtonPress = useAuth((state) => state.onGoogleLinkButtonPress);

  return (
    <View
      style={{
        ...containerStyles.defaultPageStyle,
        ...containerStyles.centerAll,
      }}
    >
      <Image
        resizeMethod="scale"
        resizeMode="cover"
        source={LOGO}
        style={{
          height: logoHeight,
          width: logoWidth,
        }}
      />
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
