import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamsList } from "../../utils/types";
import useTheme from "../../theme/useTheme";
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { DatePickerWrapper, useDatePicker } from "../../components";
import { useRepeatRentalModal } from "../../features/scheduling";

export interface IRepeatRentalModalProps {
  route: RouteProp<RootStackParamsList, "repeat-rental-modal">;
  navigation: StackNavigationProp<RootStackParamsList, "repeat-rental-modal">;
}

export default function RepeatRentalModal({
  navigation,
  route,
}: IRepeatRentalModalProps) {
  const { containerStyles, textStyles, buttonStyles, inputStyles } = useTheme();

  const {
    startDate,
    endDate,
    errors,
    isSubmitting,
    handleSubmit,
    setRental,
    onChangeStartDate,
    onChangeEndDate,
  } = useRepeatRentalModal({ route, navigation });

  const { date: formStartDate, ...startDatePickerProps } = useDatePicker({
    defaultDate: new Date(),
    onConfirmCallback: (date) => onChangeStartDate(date),
  });
  const { date: formEndDate, ...endDatePickerProps } = useDatePicker({
    defaultDate: new Date(),
    onConfirmCallback: (date) => onChangeEndDate(date),
  });

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <View style={containerStyles.defaultModalBackdrop}>
        <StatusBar style="auto" />
        <TouchableWithoutFeedback>
          <View style={{ ...containerStyles.defaultModalContainer, gap: 12 }}>
            <Text style={textStyles.modalTitle}>Repeat Rental</Text>
            {/* Date */}
            <View style={styles.inputContainer}>
              <View style={containerStyles.twoColumnRow}>
                <View style={containerStyles.twoColumnCol}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={textStyles.fieldLabel}>Start Date</Text>
                    <Text style={textStyles.required}>*</Text>
                  </View>
                  <View style={{ ...inputStyles.textInput, marginTop: 4 }}>
                    <DatePickerWrapper
                      date={formStartDate}
                      maximumDate={new Date(endDate.value)}
                      {...startDatePickerProps}
                    />
                  </View>
                </View>
                <View style={containerStyles.twoColumnCol}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={textStyles.fieldLabel}>End Date</Text>
                    <Text style={textStyles.required}>*</Text>
                  </View>
                  <View style={{ ...inputStyles.textInput, marginTop: 4 }}>
                    <DatePickerWrapper
                      minimumDate={new Date(startDate.value)}
                      date={formEndDate}
                      {...endDatePickerProps}
                    />
                  </View>
                </View>
              </View>
              {(errors.startDate || errors.endDate) && (
                <Text style={{ ...textStyles.fieldError, marginTop: 4 }}>
                  {errors.startDate?.message || errors.endDate?.message}
                </Text>
              )}
            </View>

            <View>
              <TouchableNativeFeedback
                onPress={handleSubmit(setRental)}
                disabled={isSubmitting}
              >
                <View
                  style={{
                    ...containerStyles.centerAll,
                    ...(isSubmitting
                      ? buttonStyles.disabled
                      : buttonStyles.cta),
                  }}
                >
                  <Text style={textStyles.buttonText}>Schedule</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={navigation.goBack}
                disabled={isSubmitting}
              >
                <View
                  style={{
                    ...containerStyles.centerAll,
                    ...(isSubmitting
                      ? buttonStyles.disabled
                      : buttonStyles.cancel),
                    marginTop: 8,
                  }}
                >
                  <Text style={textStyles.buttonText}>Cancel</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    zIndex: 1,
    marginTop: 4,
    marginBottom: 16,
  },
});
