import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";

import { TCustomer } from "../types";
import useTheme from "../../../theme/useTheme";
import { RentalCard } from "../../scheduling";
import { useCustomerCard } from "../hooks/useCustomerCard";
import { RootStackParamsList } from "../../../utils/types";

interface ICustomerCardProps extends TCustomer {
  navigation: StackNavigationProp<RootStackParamsList, "customers">;
}

export function CustomerCard({
  name,
  address,
  contactNumbers,
  id,
  navigation,
}: ICustomerCardProps) {
  const { containerStyles, textStyles } = useTheme();

  const {
    customerRentals,
    canDelete,
    handleMessageClick,
    handleScheduleClick,
    handlePencilClick,
    handleDeleteClick,
  } = useCustomerCard({
    id,
    name,
    address,
    contactNumbers,
    navigation,
  });

  return (
    <View
      style={{
        ...containerStyles.cardContainer,
        gap: 8,
        backgroundColor: "white",
      }}
    >
      <View style={{ ...containerStyles.rowCenterAlign, gap: 4 }}>
        <MaterialCommunityIcon name="account" color="black" size={20} />
        <Text style={styles.detailsLabel}>{name}</Text>

        <View style={{ flex: 1 }} />

        <TouchableNativeFeedback onPress={handleScheduleClick}>
          <MaterialCommunityIcon
            name="calendar-clock"
            color="green"
            size={20}
          />
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={handleMessageClick}>
          <MaterialCommunityIcon name="message" color="green" size={20} />
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={handlePencilClick}>
          <MaterialCommunityIcon name="pencil" color="#EC9110" size={20} />
        </TouchableNativeFeedback>

        {canDelete && (
          <TouchableNativeFeedback onPress={handleDeleteClick}>
            <MaterialCommunityIcon name="delete" color="red" size={20} />
          </TouchableNativeFeedback>
        )}
      </View>

      <View style={{ ...containerStyles.rowCenterAlign, gap: 4 }}>
        <MaterialCommunityIcon name="map-marker" color="black" size={20} />
        <Text style={styles.detailsLabel}>{address}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 4 }}>
        <MaterialCommunityIcon name="phone" color="black" size={20} />
        <View>
          {contactNumbers.map((number, index) => (
            <Text key={index} style={styles.detailsLabel}>
              {number}
            </Text>
          ))}
        </View>
      </View>

      {customerRentals.length > 0 && (
        <Text style={{ ...textStyles.cardFieldLabel, marginTop: 8 }}>
          Recent Rentals
        </Text>
      )}
      {customerRentals.map((rental) => (
        <RentalCard key={rental.id} {...rental} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsLabel: {
    fontWeight: "400",
    fontSize: 16,
  },
});
