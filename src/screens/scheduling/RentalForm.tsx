import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  Keyboard,
} from "react-native";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { CheckBox, Spinner } from "@ui-kitten/components";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import useTheme from "../../theme/useTheme";
import { useRentalForm } from "../../features/scheduling";
import {
  AutoComplete,
  DatePickerWrapper,
  Dropdown,
  useAutoComplete,
  useDatePicker,
  useDropdown,
} from "../../components";
import ListTextInput, {
  useListTextInput,
} from "../../components/list-textinput";
import ListKeyValue, { useListKeyValue } from "../../components/list-key-value";
import { RATE_INTERVAL_OPTIONS } from "../../utils/contstants";
import { RootStackParamsList } from "../../utils/types";

export interface IRentalFormProps {
  route: RouteProp<RootStackParamsList, "rental-form">;
  navigation: StackNavigationProp<RootStackParamsList, "rental-form">;
}

export default function RentalForm({ route }: IRentalFormProps) {
  const { buttonStyles, containerStyles, inputStyles, textStyles } = useTheme();

  const {
    states: {
      assetList,
      address,
      assetId,
      comments,
      customerName,
      rateInterval,
      includeSundays,
      dailyRate,
      weeklyRate,
      monthlyRate,
      yearlyRate,
      mobilizationFee,
      safetyDeposit,
      errors,
      isSubmitting,
      customerList,
      startDate,
      endDate,
    },
    functions: {
      handleSubmit,
      setRental,
      onAssetSelect,
      onRateIntervalSelect,
      onAddContactNumber,
      onRemoveContactNumber,
      onAddExpenses,
      onRemoveExpenses,
      onChangeStartDate,
      onChangeEndDate,
      onToggleIncludeSundays,
      onSelectCustomerOption,
      preloadFields,
      preloadCustomerFields,
    },
  } = useRentalForm();

  const {
    getSelectedOption: getSelectedStandardRateInterval,
    onSelect: onSelectStandardRate,
    ...dropdownStandardRateIntervalProps
  } = useDropdown({
    options: RATE_INTERVAL_OPTIONS,
    onSelectCallback: onRateIntervalSelect,
    defaultSelectedValue: rateInterval?.value,
  });

  const { getSelectedOption: getSelectedAsset, ...dropdownSelectedAssetProps } =
    useDropdown({
      options: assetList,
      onSelectCallback: (optionId: string) => {
        onAssetSelect(optionId, onSelectStandardRate);
      },
      defaultSelectedValue:
        assetId?.value || route.params?.rentalDetails?.asset.id,
    });

  const listTextInputProps = useListTextInput({
    onAdd: onAddContactNumber,
    onRemove: onRemoveContactNumber,
  });
  const listKeyValueProps = useListKeyValue({
    onAdd: onAddExpenses,
    onRemove: onRemoveExpenses,
  });

  const { ...autoCompleteProps } = useAutoComplete({
    options: customerList.map((customer) => ({
      id: customer.id || "",
      name: customer.name,
      contactNumbers: customer.contactNumbers,
    })),
    onSelectCallback: (optionId: string) => {
      Keyboard.dismiss();
      const customer = customerList.find(
        (customer) => customer.id === optionId
      );
      if (customer) {
        onSelectCustomerOption(customer);
        listTextInputProps.functions.overrideValues(customer.contactNumbers);
      }
    },
  });

  const { date: formStartDate, ...startDatePickerProps } = useDatePicker({
    defaultDate: route.params?.rentalDetails?.startDate
      ? new Date(route.params?.rentalDetails?.startDate.toDate())
      : new Date(),
    onConfirmCallback: (date) => onChangeStartDate(date),
  });
  const { date: formEndDate, ...endDatePickerProps } = useDatePicker({
    defaultDate: route.params?.rentalDetails?.endDate
      ? new Date(route.params?.rentalDetails?.endDate.toDate())
      : new Date(),
    onConfirmCallback: (date) => onChangeEndDate(date),
  });

  useEffect(() => {
    if (route.params?.isEditing && route.params.rentalDetails) {
      preloadFields(route.params.rentalDetails);
      onSelectStandardRate(route.params.rentalDetails.rateInterval);

      if (route.params.rentalDetails.customer.contactNumbers.length > 0) {
        listTextInputProps.functions.overrideValues(
          route.params.rentalDetails.customer.contactNumbers
        );
      }

      if (route.params.rentalDetails.expenses.length > 0) {
        listKeyValueProps.functions.overrideValues(
          route.params.rentalDetails.expenses
        );
      }
    }

    if (route.params?.isFromCustomer && route.params.customerDetails) {
      preloadCustomerFields(route.params.customerDetails);
      if (route.params.customerDetails.contactNumbers.length > 0) {
        listTextInputProps.functions.overrideValues(
          route.params.customerDetails.contactNumbers
        );
      }
    }
  }, []);

  return (
    <View style={containerStyles.defaultPageStyle}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Asset */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Asset </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={{ ...styles.inputContainer, zIndex: 10 }}>
          <Dropdown
            {...dropdownSelectedAssetProps}
            getSelectedOption={getSelectedAsset}
          />
          {errors.assetId && (
            <Text style={textStyles.fieldError}>{errors.assetId.message}</Text>
          )}
        </View>
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
                  value={formStartDate}
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
                  value={formEndDate}
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

        {/* Customer */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Customer </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={{ ...styles.inputContainer, zIndex: 9999 }}>
          <AutoComplete
            {...autoCompleteProps}
            value={customerName.value}
            onChangeText={customerName.onChange}
          />
          {errors.customerName && (
            <Text style={textStyles.fieldError}>
              {errors.customerName.message}
            </Text>
          )}
        </View>
        {/* Address */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Address </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={address.value}
            onChangeText={address.onChange}
          />
          {errors.address && (
            <Text style={textStyles.fieldError}>{errors.address.message}</Text>
          )}
        </View>
        {/* Contact number(s) */}
        <Text style={textStyles.fieldLabel}>Contact number(s) </Text>
        <View style={styles.inputContainer}>
          <ListTextInput
            {...listTextInputProps.states}
            {...listTextInputProps.functions}
            inputMode="numeric"
            emptyPlaceholder="No numbers added"
          />
        </View>

        {/* rates */}
        <Text
          style={{ ...textStyles.formSection, marginTop: 8, marginBottom: 16 }}
        >
          Rates
        </Text>

        {/* Rate Interval */}
        <View style={containerStyles.twoColumnCol}>
          <Text style={textStyles.fieldLabel}>Standard Rate Interval</Text>
          <View style={styles.inputContainer}>
            <Dropdown
              {...dropdownStandardRateIntervalProps}
              onSelect={onSelectStandardRate}
              getSelectedOption={getSelectedStandardRateInterval}
              // optionsContainerMaxHeight={100}
            />
          </View>
        </View>

        {/* Daily rate */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Daily Rate </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={dailyRate.value}
            placeholder="0 Php"
            inputMode="numeric"
            onChangeText={dailyRate.onChange}
          />
          {errors.dailyRate && (
            <Text style={textStyles.fieldError}>
              {errors.dailyRate.message}
            </Text>
          )}
        </View>

        {/* Weekly rate */}
        {rateInterval.value === "2" && (
          <>
            <View style={{ flexDirection: "row" }}>
              <Text style={textStyles.fieldLabel}>Weekly Rate </Text>
              <Text style={textStyles.required}>*</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={inputStyles.textInput}
                value={weeklyRate.value || ""}
                placeholder="0 Php"
                inputMode="numeric"
                onChangeText={weeklyRate.onChange}
              />
              {errors.weeklyRate && (
                <Text style={textStyles.fieldError}>
                  {errors.weeklyRate.message}
                </Text>
              )}
            </View>
          </>
        )}

        {/* Monthly Rate */}
        {rateInterval.value === "3" && (
          <>
            <View style={{ flexDirection: "row" }}>
              <Text style={textStyles.fieldLabel}>Monthly Rate </Text>
              <Text style={textStyles.required}>*</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={inputStyles.textInput}
                value={monthlyRate.value || ""}
                placeholder="0 Php"
                inputMode="numeric"
                onChangeText={monthlyRate.onChange}
              />
              {errors.monthlyRate && (
                <Text style={textStyles.fieldError}>
                  {errors.monthlyRate.message}
                </Text>
              )}
            </View>
          </>
        )}

        {/* Yearly Rate */}
        {rateInterval.value === "4" && (
          <>
            <View style={{ flexDirection: "row" }}>
              <Text style={textStyles.fieldLabel}>Yearly Rate </Text>
              <Text style={textStyles.required}>*</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={inputStyles.textInput}
                value={yearlyRate.value || ""}
                placeholder="0 Php"
                inputMode="numeric"
                onChangeText={yearlyRate.onChange}
              />
              {errors.yearlyRate && (
                <Text style={textStyles.fieldError}>
                  {errors.yearlyRate.message}
                </Text>
              )}
            </View>
          </>
        )}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CheckBox
            status="warning"
            checked={includeSundays.value}
            onChange={(checked) => onToggleIncludeSundays(checked)}
          />
          <Text
            style={{
              ...textStyles.normalTextSmall,
              marginTop: 3,
              marginLeft: 4,
            }}
          >
            Include Sundays?
          </Text>
        </View>

        {/* others */}
        <Text style={{ ...textStyles.formSection, marginVertical: 16 }}>
          Others
        </Text>

        {/* mobilization fee and safety deposit */}
        <View style={containerStyles.twoColumnRow}>
          <View style={containerStyles.twoColumnCol}>
            <Text style={textStyles.fieldLabel}>Mobilization fee </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={inputStyles.textInput}
                keyboardType="number-pad"
                value={mobilizationFee.value}
                onChangeText={mobilizationFee.onChange}
              />
            </View>
          </View>
          <View style={containerStyles.twoColumnCol}>
            <Text style={textStyles.fieldLabel}>Safety deposit</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={inputStyles.textInput}
                keyboardType="number-pad"
                value={safetyDeposit.value}
                onChangeText={safetyDeposit.onChange}
              />
            </View>
          </View>
        </View>

        {/* expenses */}
        <Text style={textStyles.fieldLabel}>Expenses</Text>
        <View style={styles.inputContainer}>
          <ListKeyValue
            namePlaceholder="Name"
            valuePlaceholder="Amount"
            emptyPlaceholder="No expenses added"
            {...listKeyValueProps.states}
            {...listKeyValueProps.functions}
          />
        </View>

        {/* comments */}
        <Text style={textStyles.fieldLabel}>Comments</Text>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            numberOfLines={4}
            style={inputStyles.multilineTextInput}
            value={comments.value}
            onChangeText={comments.onChange}
          />
        </View>
      </ScrollView>
      <TouchableNativeFeedback
        onPress={handleSubmit(setRental)}
        disabled={isSubmitting}
      >
        <View
          style={{
            ...containerStyles.centerAll,
            ...(isSubmitting ? buttonStyles.disabled : buttonStyles.cta),
          }}
        >
          {isSubmitting ? (
            <Spinner style={styles.spinnerStyle} />
          ) : (
            <Text style={{ ...(textStyles.buttonText as object) }}>
              {route.params?.isEditing ? "Update Rental" : "Set Rental"}
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
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
