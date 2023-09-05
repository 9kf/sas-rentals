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
import { PAYMENT_STATUS_OPTIONS } from "../../utils/contstants";
import { useRentalSchedulingService } from "../../features/scheduling/service";
import { useToast } from "../../components";

export interface IUpdatePaymentModalProps {
  route: RouteProp<RootStackParamsList, "update-payment-status-modal">;
  navigation: StackNavigationProp<
    RootStackParamsList,
    "update-payment-status-modal"
  >;
}

export default function UpdatePaymentModal({
  navigation,
  route,
}: IUpdatePaymentModalProps) {
  const { containerStyles, textStyles, buttonStyles } = useTheme();
  const {
    params: {
      assetName,
      currentPaymentStatusId,
      rentalId,
      assetId,
      rentalStatusId,
    },
  } = route;
  const { updatePaymentStatus, updateOverallProfit } =
    useRentalSchedulingService();
  const showToast = useToast((state) => state.showToast);

  const [paymentId, setPaymentId] = useState(currentPaymentStatusId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleUpdatePaymentStatus() {
    setIsSubmitting(true);
    updatePaymentStatus(
      rentalId || "",
      paymentId || "",
      () => {
        setIsSubmitting(false);
        navigation.goBack();
        showToast({
          title: "Success",
          message: "Rental has been updated.",
          type: "success",
        });
        if (paymentId === "3") {
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
          >{`Update Payment Status for ${assetName}`}</Text>

          {PAYMENT_STATUS_OPTIONS.map((option) => (
            <View
              key={option.id}
              style={{ ...containerStyles.rowCenterAlign, marginBottom: 8 }}
            >
              <CheckBox
                style={{ marginRight: 8 }}
                status="warning"
                checked={option.id === paymentId}
                onChange={(checked) => {
                  if (checked) {
                    setPaymentId(option.id);
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
                onPress={handleUpdatePaymentStatus}
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
