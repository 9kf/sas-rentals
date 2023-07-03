import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { BottomTabs } from "./src/components";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { default as theme } from "./theme.json";
import AssetsForm from "./src/screens/assets/AssetForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamsList } from "./src/utils/types";
import AssetDetails from "./src/screens/assets/AssetDetails";
import { Toast } from "./src/components";
import RentalForm from "./src/screens/scheduling/RentalForm";

const MainStack = createStackNavigator<RootStackParamsList>();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <SafeAreaView style={{ height: "100%" }}>
        <NavigationContainer>
          <StatusBar translucent backgroundColor="#FFF4E9" />
          <MainStack.Navigator>
            <MainStack.Screen
              name={"main"}
              component={BottomTabs}
              options={{
                headerShown: false,
                title: "Home",
              }}
            />
            <MainStack.Screen
              name={"asset-form"}
              component={AssetsForm}
              options={({ route }) => ({
                title: route.params?.isEditing ? "Edit Asset" : "Add Asset",
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  backgroundColor: "#FFF4E9",
                },
              })}
            />
            <MainStack.Screen
              name={"asset-details"}
              component={AssetDetails}
              options={{
                title: "Details",
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  backgroundColor: "#FFF4E9",
                },
              }}
            />
            <MainStack.Screen
              name={"rental-form"}
              component={RentalForm}
              options={({ route }) => ({
                title: route.params?.isEditing
                  ? "Edit Rental"
                  : "Schedule Rental",
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  backgroundColor: "#FFF4E9",
                },
              })}
            />
          </MainStack.Navigator>
        </NavigationContainer>

        <Toast />
      </SafeAreaView>
    </ApplicationProvider>
  );
}
