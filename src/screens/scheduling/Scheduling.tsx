import { Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import useTheme from "../../theme/useTheme";
import { FloatingActionButton, RNCAlendars } from "../../components";
import { RentalCard, useScheduling } from "../../features/scheduling";
import { RootStackParamsList } from "../../utils/types";

export interface ISchedulingProps {
  route: RouteProp<RootStackParamsList, "schedules">;
  navigation: StackNavigationProp<RootStackParamsList, "schedules">;
}

export default function Scheduling({ navigation, route }: ISchedulingProps) {
  const { containerStyles, textStyles } = useTheme();
  const {
    states: { markedDates, rentals },
    functions: { onMonthChange },
  } = useScheduling({ navigation, route });

  return (
    <View style={{ ...containerStyles.defaultPageStyle, paddingTop: 0 }}>
      <ScrollView style={{ height: "100%", paddingBottom: 12 }}>
        <RNCAlendars
          onMonthChange={onMonthChange}
          markingType="multi-period"
          markedDates={markedDates}
        />

        {rentals.length > 0 && (
          <Text
            style={{
              ...textStyles.normalText,
              fontWeight: "300",
              marginVertical: 12,
            }}
          >
            Rentals
          </Text>
        )}
        {rentals.map((rental) => (
          <RentalCard
            key={rental.id}
            isReadOnly={false}
            {...rental}
            onClickUpdatePayment={() =>
              navigation.push("update-payment-status-modal", {
                assetName: rental.asset.name,
                assetId: rental.asset.id,
                rentalId: rental.id || "",
                rentalStatusId: rental.rentalStatus.id,
                currentPaymentStatusId: rental.paymentStatus.id,
              })
            }
            onClickUpdateRental={() =>
              navigation.push("update-rental-status-modal", {
                assetName: rental.asset.name,
                assetId: rental.asset.id,
                rentalId: rental.id || "",
                paymentStatusId: rental.paymentStatus.id,
                currentRentalStatusId: rental.rentalStatus.id,
              })
            }
            onClickCard={() =>
              navigation.push("rental-details", {
                rentalDetails: rental,
              })
            }
          />
        ))}
      </ScrollView>
      <FloatingActionButton onClick={() => navigation.push("rental-form")} />
    </View>
  );
}
