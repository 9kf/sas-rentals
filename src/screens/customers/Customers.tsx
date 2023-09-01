import { View, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import useTheme from "../../theme/useTheme";
import { RootStackParamsList } from "../../utils/types";
import { CustomerCard, useCustomers } from "../../features/customers";
import { FloatingActionButton } from "../../components";

export interface ICustomerProps {
  route: RouteProp<RootStackParamsList, "customers">;
  navigation: StackNavigationProp<RootStackParamsList, "customers">;
}

export default function Customers({ navigation, route }: ICustomerProps) {
  const { containerStyles } = useTheme();
  const { customerList } = useCustomers();

  return (
    <View style={containerStyles.defaultPageStyle}>
      <ScrollView>
        <View style={{ gap: 12 }}>
          {customerList.map((customer) => (
            <CustomerCard
              key={customer.id}
              navigation={navigation}
              {...customer}
            />
          ))}
        </View>
      </ScrollView>
      <FloatingActionButton onClick={() => navigation.push("customer-modal")} />
    </View>
  );
}
