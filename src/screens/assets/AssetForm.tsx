import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
  Image,
} from "react-native";
import { Spinner } from "@ui-kitten/components";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Dropdown, useDropdown } from "../../components";
import useTheme from "../../theme/useTheme";
import {
  CONDITION_OPTIONS,
  RATE_INTERVAL_OPTIONS,
} from "../../utils/contstants";
import { useImagePicker } from "../../utils/hooks";
import { useAssetForm } from "../../features/assets";
import { RootStackParamsList } from "../../utils/types";

export interface IAssetFormProps {
  route: RouteProp<RootStackParamsList, "asset-form">;
  navigation: StackNavigationProp<RootStackParamsList, "asset-form">;
}

export default function AssetsForm({ route }: IAssetFormProps) {
  const { buttonStyles, containerStyles, inputStyles, textStyles } = useTheme();

  const {
    states: {
      assetName,
      assetDailyRate,
      assetMonthlyRate,
      assetWeeklyRate,
      assetYearlyRate,
      assetDescription,
      assetPhoto,
      assetCondition,
      assetStandardRateInterval,
      isSubmitting,
      errors,
    },
    functions: {
      handleSubmit,
      addAsset,
      onConditionSelect,
      onRateIntervalSelect,
      onSelectPhoto,
      removePhoto,
      updateAsset,
    },
  } = useAssetForm(
    route.params?.isEditing
      ? {
          ...route?.params?.assetDetails,
          condition: route?.params?.assetDetails?.condition,
          dailyRate: route?.params?.assetDetails?.dailyRate || "0",
        }
      : undefined
  );

  const { getSelectedOption: getSelectedCondition, ...dropdownConditionProps } =
    useDropdown({
      options: CONDITION_OPTIONS,
      onSelectCallback: onConditionSelect,
      defaultSelectedValue: assetCondition?.value,
    });

  const {
    getSelectedOption: getSelectedStandardRateInterval,
    ...dropdownStandardRateIntervalProps
  } = useDropdown({
    options: RATE_INTERVAL_OPTIONS,
    onSelectCallback: onRateIntervalSelect,
    defaultSelectedValue: assetStandardRateInterval?.value,
  });

  const { pickPhoto } = useImagePicker({
    onPickPhotoCallback: onSelectPhoto,
  });

  return (
    <View style={containerStyles.defaultPageStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyles.fieldLabel}>Asset Name </Text>
          <Text style={textStyles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={assetName.value}
            onChangeText={assetName.onChange}
          />
          {errors.name && (
            <Text style={textStyles.fieldError}>{errors.name.message}</Text>
          )}
        </View>
        <Text style={textStyles.fieldLabel}>Description</Text>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            numberOfLines={4}
            style={inputStyles.multilineTextInput}
            value={assetDescription.value}
            onChangeText={assetDescription.onChange}
          />
        </View>
        <Text style={textStyles.fieldLabel}>Condition</Text>
        <View style={{ ...styles.inputContainer, zIndex: 50 }}>
          <Dropdown
            {...dropdownConditionProps}
            getSelectedOption={getSelectedCondition}
          />
        </View>

        <Text style={textStyles.fieldLabel}>Picture</Text>
        {assetPhoto?.value ? (
          <View
            style={{
              ...containerStyles.twoColumnRow,
              marginBottom: 16,
            }}
          >
            <View style={containerStyles.twoColumnCol}>
              <TouchableNativeFeedback onPress={pickPhoto}>
                <View
                  style={{
                    ...containerStyles.centerAll,
                    ...buttonStyles.uploadButton,
                  }}
                >
                  <Text style={{ ...textStyles.buttonText }}>
                    Replace Image
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={containerStyles.twoColumnCol}>
              <TouchableNativeFeedback onPress={removePhoto}>
                <View
                  style={{
                    ...containerStyles.centerAll,
                    ...buttonStyles.destructive,
                  }}
                >
                  <Text style={{ ...textStyles.buttonText }}>Remove Image</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TouchableNativeFeedback onPress={pickPhoto}>
              <View
                style={{
                  ...containerStyles.centerAll,
                  ...buttonStyles.uploadButton,
                }}
              >
                <Text style={{ ...textStyles.buttonText }}>Select Image</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        )}

        <View
          style={{
            ...styles.inputContainer,
            ...containerStyles.centerAll,
          }}
        >
          {assetPhoto?.value ? (
            <Image
              source={{ uri: assetPhoto?.value }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Text>No Photo</Text>
          )}
        </View>

        <Text style={{ ...textStyles.formSection, marginVertical: 16 }}>
          Rates
        </Text>

        {/* Standard Rate Interval */}
        <View style={containerStyles.twoColumnCol}>
          <Text style={textStyles.fieldLabel}>Standard Rate Interval</Text>
          <View style={styles.inputContainer}>
            <Dropdown
              {...dropdownStandardRateIntervalProps}
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
            value={assetDailyRate.value}
            placeholder="0 Php"
            inputMode="numeric"
            onChangeText={assetDailyRate.onChange}
          />
          {errors.dailyRate && (
            <Text style={textStyles.fieldError}>
              {errors.dailyRate.message}
            </Text>
          )}
        </View>

        {/* Weekly rate */}
        <Text style={textStyles.fieldLabel}>Weekly Rate </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={assetWeeklyRate.value || ""}
            placeholder="0 Php"
            inputMode="numeric"
            onChangeText={assetWeeklyRate.onChange}
          />
        </View>

        {/* Monthly Rate */}
        <Text style={textStyles.fieldLabel}>Monthly Rate </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={assetMonthlyRate.value || ""}
            placeholder="0 Php"
            inputMode="numeric"
            onChangeText={assetMonthlyRate.onChange}
          />
        </View>

        {/* Yearly Rate */}
        <Text style={textStyles.fieldLabel}>Yearly Rate </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={inputStyles.textInput}
            value={assetYearlyRate.value || ""}
            placeholder="0 Php"
            inputMode="numeric"
            onChangeText={assetYearlyRate.onChange}
          />
        </View>
      </ScrollView>
      <TouchableNativeFeedback
        onPress={
          route.params?.isEditing
            ? handleSubmit((data) =>
                updateAsset(data, route.params?.assetDetails?.id || "")
              )
            : handleSubmit(addAsset)
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
            <Text style={{ ...textStyles.buttonText }}>Confirm</Text>
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
