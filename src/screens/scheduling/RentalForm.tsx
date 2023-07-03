import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
} from "react-native";
import useTheme from "../../theme/useTheme";
import { ScrollView } from "react-native-gesture-handler";
import { useRentalForm } from "../../features/scheduling";
import { Dropdown, useDropdown } from "../../components";
import { useRangeDatePicker } from "../../utils/hooks";
import { RangeDatepicker, Spinner } from "@ui-kitten/components";
import ListTextInput, {
  useListTextInput,
} from "../../components/list-textinput";
import ListKeyValue, { useListKeyValue } from "../../components/list-key-value";
import { RATE_INTERVAL_OPTIONS } from "../../utils/contstants";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamsList } from "../../utils/types";

export default function RentalForm() {
  const { buttonStyles, containerStyles, inputStyles, textStyles } = useTheme();

  const route = useRoute<RouteProp<RootStackParamsList, "rental-form">>();

  const {
    states: {
      assetList,
      address,
      assetId,
      comments,
      contactNumbers,
      customerName,
      dateRange,
      expenses,
      mobilizationFee,
      rateInterval,
      safetyDeposit,
      standardRate,
      errors,
      isSubmitting,
    },
    functions: { handleSubmit, setRental, onAssetSelect, onRateIntervalSelect },
  } = useRentalForm();

  const { getSelectedOption: getSelectedCondition, ...dropdownConditionProps } =
    useDropdown({
      options: assetList,
      onSelectCallback: onAssetSelect,
      defaultSelectedValue: assetId?.value,
    });

  const {
    getSelectedOption: getSelectedRateInterval,
    ...dropdownRateIntervalProps
  } = useDropdown({
    options: RATE_INTERVAL_OPTIONS,
    onSelectCallback: onRateIntervalSelect,
    defaultSelectedValue: rateInterval.value,
  });

  const listTextInputProps = useListTextInput();
  const listKeyValueProps = useListKeyValue();

  const { states, functions } = useRangeDatePicker();

  return (
    <View style={containerStyles.defaultPageStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Asset */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Asset </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={{ ...styles.inputContainer, zIndex: 10 }}>
          <Dropdown
            {...dropdownConditionProps}
            getSelectedOption={getSelectedCondition}
          />
          {errors.assetId && (
            <Text style={textStyles.fieldError}>{errors.assetId.message}</Text>
          )}
        </View>
        {/* Date */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Date </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <RangeDatepicker {...states} {...functions} />
        </View>
        {/* Customer */}
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Customer </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={customerName.value}
            onChangeText={customerName.onChange}
          />
        </View>
        {/* Contact number(s) */}
        <Text style={textStyles.fieldLabel}>Contact number(s) </Text>
        <View style={styles.inputContainer}>
          <ListTextInput
            {...listTextInputProps.states}
            {...listTextInputProps.functions}
          />
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
        </View>
        {/* standard rate and rate interval */}
        <View
          style={{ ...(containerStyles.twoColumnRow as object), zIndex: 10 }}
        >
          <View style={containerStyles.twoColumnCol}>
            <View style={{ flexDirection: "row" }}>
              <Text style={textStyles.fieldLabel}>Standard Rate </Text>
              <Text style={textStyles.required}>*</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={inputStyles.textInput}
                keyboardType="number-pad"
                value={standardRate.value}
                onChangeText={standardRate.onChange}
              />
              {errors.standardRate && (
                <Text style={textStyles.fieldError}>
                  {errors.standardRate.message}
                </Text>
              )}
            </View>
          </View>
          <View style={containerStyles.twoColumnCol}>
            <Text style={textStyles.fieldLabel}>Rate Interval </Text>
            <View style={styles.inputContainer}>
              <Dropdown
                {...dropdownRateIntervalProps}
                getSelectedOption={getSelectedRateInterval}
                optionsContainerMaxHeight={100}
              />
            </View>
          </View>
        </View>
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
        {/* other */}

        <Text style={{ ...textStyles.formSection, marginVertical: 16 }}>
          Other
        </Text>

        {/* expenses */}
        <Text style={textStyles.fieldLabel}>Expenses</Text>
        <View style={styles.inputContainer}>
          <ListKeyValue
            namePlaceholder="Name"
            valuePlaceholder="Amount"
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
        onPress={
          route.params?.isEditing
            ? handleSubmit((data) => {
                // updateAsset(data, route.params?.assetDetails?.id || "")
              })
            : handleSubmit(setRental)
        }
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
              Set rental
            </Text>
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  spinnerStyle: {
    borderColor: "white",
  },
});
