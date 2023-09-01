import { RouteProp } from "@react-navigation/native";
import { useEffect } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { RootStackParamsList } from "../../utils/types";
import useTheme from "../../theme/useTheme";
import ListTextInput, {
  useListTextInput,
} from "../../components/list-textinput";
import { useCustomerModal } from "../../features/customers";

export interface ICustomerModalProps {
  route: RouteProp<RootStackParamsList, "customer-modal">;
  navigation: StackNavigationProp<RootStackParamsList, "customer-modal">;
}

export default function CustomerModal({
  navigation,
  route,
}: ICustomerModalProps) {
  const { containerStyles, textStyles, buttonStyles, inputStyles } = useTheme();
  const {
    address,
    name,
    errors,
    isSubmitting,
    CTAText,
    onAddContactNumber,
    onRemoveContactNumber,
    preloadFields,
    handleSubmit,
    setCustomer,
  } = useCustomerModal({ navigation, route });

  const listTextInputProps = useListTextInput({
    onAdd: onAddContactNumber,
    onRemove: onRemoveContactNumber,
  });

  useEffect(() => {
    if (route.params?.isUpdate && route.params?.customerDetails) {
      preloadFields(route.params.customerDetails);

      if (route.params.customerDetails.contactNumbers.length > 0) {
        listTextInputProps.functions.overrideValues(
          route.params.customerDetails.contactNumbers
        );
      }
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <View style={containerStyles.defaultModalBackdrop}>
        <StatusBar style="auto" />
        <View style={{ ...containerStyles.defaultModalContainer, gap: 12 }}>
          <Text style={textStyles.modalTitle}>
            {route.params?.isUpdate
              ? "Update Contact Information"
              : "Add Contact"}{" "}
          </Text>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={textStyles.fieldLabel}>Customer Name </Text>
              <Text style={textStyles.required}>*</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                editable={route.params?.isUpdate ? false : true}
                style={
                  route.params?.isUpdate
                    ? { ...inputStyles.textInput, color: "gray" }
                    : inputStyles.textInput
                }
                value={name.value}
                onChangeText={name.onChange}
              />
              {errors.name && (
                <Text style={textStyles.fieldError}>{errors.name.message}</Text>
              )}
            </View>

            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={textStyles.fieldLabel}>Address </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={inputStyles.textInput}
                  value={address.value}
                  onChangeText={address.onChange}
                />
              </View>
            </View>

            <View>
              <Text style={textStyles.fieldLabel}>Contact number(s) </Text>
              <View style={styles.inputContainer}>
                <ListTextInput
                  {...listTextInputProps.states}
                  {...listTextInputProps.functions}
                  inputMode="numeric"
                  emptyPlaceholder="No numbers added"
                />
              </View>
            </View>
          </View>

          <View style={{ ...containerStyles.twoColumnRow, marginTop: 16 }}>
            <View style={containerStyles.twoColumnCol}>
              <TouchableOpacity
                style={{
                  ...containerStyles.centerAll,
                  ...(isSubmitting ? buttonStyles.disabled : buttonStyles.cta),
                }}
                disabled={isSubmitting}
                onPress={handleSubmit(setCustomer)}
              >
                <Text style={{ ...textStyles.buttonText }}>{CTAText}</Text>
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

const styles = StyleSheet.create({
  inputContainer: {
    zIndex: 1,
    marginTop: 4,
    marginBottom: 16,
  },
  spinnerStyle: {
    borderColor: "white",
  },
});
