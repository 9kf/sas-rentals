import { View, Text } from "react-native";
import useTheme from "../../theme/useTheme";
import { FloatingActionButton } from "../../components";
import routes from "../../utils/routes";

export default function Scheduling({ navigation }) {
  const { containerStyles, textStyles } = useTheme();

  return (
    <View style={containerStyles.defaultPageStyle}>
      <View style={containerStyles.verticalCenterAlign}>
        <Text>Scheduling</Text>
      </View>
      <FloatingActionButton
        onClick={() => navigation.push(routes.rentalForm)}
      />
    </View>
  );
}
