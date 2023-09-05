import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialDesignIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Scheduling from "../../screens/scheduling/Scheduling";
import Transactions from "../../screens/transactions/Transactions";
import Customers from "../../screens/customers/Customers";
import Assets from "../../screens/assets/Assets";
import { RootStackParamsList } from "../../utils/types";

const Tab = createBottomTabNavigator<RootStackParamsList>();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "#FFF4E9",
        },
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "#EC9110",
        tabBarStyle: {
          backgroundColor: "#3D3D3D",
        },
      })}
    >
      <Tab.Screen
        name={"assets"}
        options={{
          title: "Assets",
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons
              name="hammer-wrench"
              color={color}
              size={size}
            />
          ),
        }}
        component={Assets}
      />
      <Tab.Screen
        name={"schedules"}
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons
              name="calendar-month"
              color={color}
              size={size}
            />
          ),
        }}
        component={Scheduling}
      />
      <Tab.Screen
        name={"transactions"}
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons
              name="credit-card-outline"
              color={color}
              size={size}
            />
          ),
        }}
        component={Transactions}
      />
      <Tab.Screen
        name={"customers"}
        options={{
          title: "Customers",
          tabBarIcon: ({ color, size }) => (
            <MaterialDesignIcons name="account" color={color} size={size} />
          ),
        }}
        component={Customers}
      />
    </Tab.Navigator>
  );
}
