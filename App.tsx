import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import * as eva from "@eva-design/eva";
import auth from "@react-native-firebase/auth";

import { BottomTabs } from "./src/components";
import { default as theme } from "./theme.json";
import AssetsForm from "./src/screens/assets/AssetForm";
import { RootStackParamsList } from "./src/utils/types";
import AssetDetails from "./src/screens/assets/AssetDetails";
import { Toast } from "./src/components";
import RentalForm from "./src/screens/scheduling/RentalForm";
import UpdatePaymentModal from "./src/screens/modals/UpdatePaymentModal";
import UpdateRentalModal from "./src/screens/modals/UpdateRentalModal";
import RentalDetails from "./src/screens/scheduling/RentalDetails";
import ConfirmDeleteModal from "./src/screens/modals/ConfirmDeleteModal";
import CustomerModal from "./src/screens/modals/CustomerModal";
import RepeatRentalModal from "./src/screens/modals/RepeatRentalModal";
import { useAuth } from "./src/features/auth";
import Auth from "./src/screens/auth/Auth";
import { setNotificationHandler } from "expo-notifications";

const MainStack = createStackNavigator<RootStackParamsList>();

GoogleSignin.configure({
  webClientId:
    "200281219925-nk6umapdca4bbl1jg84ke1difrhq6798.apps.googleusercontent.com",
});

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const user = useAuth((state) => state.user);
  const onAuthChanged = useAuth((state) => state.onAuthStateChanged);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      onAuthChanged(user);
    });

    return subscriber;
  }, []);

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <SafeAreaView style={{ height: "100%" }}>
        {!user ? (
          <Auth />
        ) : (
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
                  headerStyle: styles.headerStyle,
                })}
              />
              <MainStack.Screen
                name={"asset-details"}
                component={AssetDetails}
                options={{
                  title: "Details",
                  headerStyle: styles.headerStyle,
                }}
              />
              <MainStack.Screen
                name={"rental-form"}
                component={RentalForm}
                options={({ route }) => ({
                  title: route.params?.isEditing
                    ? "Edit Rental"
                    : "Schedule Rental",
                  headerStyle: styles.headerStyle,
                })}
              />

              <MainStack.Screen
                name={"rental-details"}
                component={RentalDetails}
                options={{
                  title: "Rental Details",
                  headerStyle: styles.headerStyle,
                }}
              />

              {/* Modals */}
              <MainStack.Screen
                name="update-payment-status-modal"
                component={UpdatePaymentModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
              <MainStack.Screen
                name="update-rental-status-modal"
                component={UpdateRentalModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
              <MainStack.Screen
                name="confirm-delete-modal"
                component={ConfirmDeleteModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
              <MainStack.Screen
                name="customer-modal"
                component={CustomerModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />

              <MainStack.Screen
                name="repeat-rental-modal"
                component={RepeatRentalModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
            </MainStack.Navigator>
          </NavigationContainer>
        )}

        <Toast />
      </SafeAreaView>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFF4E9",
  },
});
