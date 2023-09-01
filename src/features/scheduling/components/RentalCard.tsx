import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import format from "date-fns/format";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

import { IRentalScheduleFirebaseResponse } from "../types";
import useTheme from "../../../theme/useTheme";

export interface RentalCardProps extends IRentalScheduleFirebaseResponse {
  onClickUpdatePayment?: () => void;
  onClickUpdateRental?: () => void;
  onClickCard?: () => void;
  isReadOnly?: boolean;
}

export function RentalCard(props: RentalCardProps) {
  const {
    asset,
    startDate,
    endDate,
    customer,
    expectedPayment,
    paymentStatus,
    rentalStatus,
    onClickUpdatePayment,
    onClickUpdateRental,
    onClickCard,
    isReadOnly = true,
  } = props;

  const { containerStyles } = useTheme();

  return (
    <TouchableNativeFeedback onPress={() => onClickCard?.()}>
      <View
        style={{
          ...containerStyles.cardContainer,
          backgroundColor: asset?.color,
          marginBottom: 12,
        }}
      >
        <View style={containerStyles.rowCenterAlign}>
          <Text style={{ ...styles.title, marginRight: 4 }}>{asset?.name}</Text>
          <Text
            style={{ ...styles.detailsSubLabel, textTransform: "capitalize" }}
          >{`(${rentalStatus.name})`}</Text>
        </View>
        <View style={{ ...styles.detailsContainer, marginTop: 6 }}>
          <MaterialCommunityIcon
            name="calendar-range"
            color="white"
            size={16}
          />
          <Text style={styles.detailsLabel}>{`${format(
            startDate.toDate(),
            "MMMM dd"
          )} - ${format(endDate.toDate(), "MMMM dd")}`}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <MaterialCommunityIcon name="account" color="white" size={16} />
          <Text style={styles.detailsLabel}>{customer.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <MaterialCommunityIcon name="cash" color="white" size={16} />
          <Text style={styles.detailsLabel}>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(expectedPayment)}
          </Text>
          <Text
            style={{ ...styles.detailsSubLabel, textTransform: "capitalize" }}
          >{`(${paymentStatus.name})`}</Text>
        </View>

        {!isReadOnly && (
          <View style={{ ...containerStyles.twoColumnRow, marginTop: 16 }}>
            <View style={containerStyles.twoColumnCol}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => onClickUpdatePayment?.()}
              >
                <Text style={{ ...styles.title, fontSize: 12 }}>
                  Update Payment Status
                </Text>
              </TouchableOpacity>
            </View>
            <View style={containerStyles.twoColumnCol}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => onClickUpdateRental?.()}
              >
                <Text style={{ ...styles.title, fontSize: 12 }}>
                  Update Rental Status
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  title: { color: "white", fontWeight: "bold", fontSize: 18 },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailsLabel: {
    color: "white",
    fontWeight: "400",
    marginLeft: 8,
    marginRight: 4,
  },
  detailsSubLabel: {
    color: "white",
    fontWeight: "300",
    fontSize: 12,
  },
  buttonStyle: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    padding: 6,
  },
});
