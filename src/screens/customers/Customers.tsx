import { View, Text } from "react-native";
import useTheme from "../../theme/useTheme";

export default function Customers() {
  const { containerStyles, textStyles } = useTheme();

  return (
    <View style={containerStyles.defaultPageStyle}>
      <View style={containerStyles.verticalCenterAlign}>
        <Text style={textStyles.title}>Customers</Text>
      </View>
    </View>
  );
}
