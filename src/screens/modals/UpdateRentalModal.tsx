import { RouteProp } from "@react-navigation/native";
import { CheckBox } from "@ui-kitten/components";
import { useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { RootStackParamsList } from "../../utils/types";
import useTheme from "../../theme/useTheme";
import { RENTAL_STATUS_OPTIONS } from "../../utils/contstants";
import { useRentalSchedulingService } from "../../features/scheduling/service";
import { useToast } from "../../components";

export interface IRentalModalProps {
  route: RouteProp<RootStackParamsList, "update-rental-status-modal">;
  navigation: StackNavigationProp<
    RootStackParamsList,
    "update-rental-status-modal"
  >;
}

export default function UpdateRentalModal({
  navigation,
  route,
}: IRentalModalProps) {
  const { containerStyles, textStyles, buttonStyles } = useTheme();
  const {
    params: {
      assetName,
      currentRentalStatusId,
      rentalId,
      assetId,
      paymentStatusId,
    },
  } = route;
  const { updateRentalStatus, updateOverallProfit } =
    useRentalSchedulingService();
  const showToast = useToast((state) => state.showToast);

  const [rentalStatusId, setRentalId] = useState(currentRentalStatusId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleUpdateRentalStatus() {
    setIsSubmitting(true);
    updateRentalStatus(
      rentalId || "",
      rentalStatusId || "",
      () => {
        setIsSubmitting(false);
        navigation.goBack();
        showToast({
          title: "Success",
          message: "Rental has been updated.",
          type: "success",
        });
        if (paymentStatusId === "3" && rentalStatusId === "3") {
          updateOverallProfit(assetId);
        }
      },
      (error) => {
        setIsSubmitting(false);
        showToast({ title: "Error", message: error, type: "error" });
      }
    );
  }

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <View style={containerStyles.defaultModalBackdrop}>
        <StatusBar style="auto" />
        <View style={containerStyles.defaultModalContainer}>
          <Text
            style={{ ...textStyles.cardTitle, marginBottom: 12 }}
          >{`Update Rental Status for ${assetName}`}</Text>

          {RENTAL_STATUS_OPTIONS.map((option) => (
            <View
              key={option.id}
              style={{ ...containerStyles.rowCenterAlign, marginBottom: 8 }}
            >
              <CheckBox
                style={{ marginRight: 8 }}
                status="warning"
                checked={option.id === rentalStatusId}
                onChange={(checked) => {
                  if (checked) {
                    setRentalId(option.id);
                  }
                }}
              />
              <Text
                style={{
                  ...textStyles.cardFieldValue,
                  textTransform: "capitalize",
                }}
              >
                {option.name}
              </Text>
            </View>
          ))}

          <View style={{ ...containerStyles.twoColumnRow, marginTop: 16 }}>
            <View style={containerStyles.twoColumnCol}>
              <TouchableOpacity
                style={{
                  ...containerStyles.centerAll,
                  ...(isSubmitting ? buttonStyles.disabled : buttonStyles.cta),
                }}
                disabled={isSubmitting}
                onPress={handleUpdateRentalStatus}
              >
                <Text style={{ ...textStyles.buttonText }}>
                  {isSubmitting ? "Updating" : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={containerStyles.twoColumnCol}>
              <TouchableOpacity
                style={{ ...containerStyles.centerAll, ...buttonStyles.cancel }}
                onPress={navigation.goBack}
              >
                <Text style={{ ...textStyles.buttonText }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
