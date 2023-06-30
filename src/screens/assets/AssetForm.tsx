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
import { Dropdown, useDropdown } from "../../components";
import useTheme from "../../theme/useTheme";
import {
  CONDITION_OPTIONS,
  RATE_INTERVAL_OPTIONS,
} from "../../utils/contstants";
import { useImagePicker } from "../../utils/hooks";
import { useAssetForm } from "../../features/assets";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamsList } from "../../utils/types";

export default function AssetsForm() {
  const { buttonStyles, containerStyles, inputStyles, textStyles } = useTheme();

  const route = useRoute<RouteProp<RootStackParamsList, "asset-form">>();

  const {
    states: {
      assetName,
      assetDescription,
      assetStandardRate,
      assetPhoto,
      assetCondition,
      assetRateInterval,
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
          standardRate: route?.params?.assetDetails?.standardRate.toString(),
          rateInterval: route?.params?.assetDetails?.rateInterval,
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
    getSelectedOption: getSelectedRateInterval,
    ...dropdownRateIntervalProps
  } = useDropdown({
    options: RATE_INTERVAL_OPTIONS,
    onSelectCallback: onRateIntervalSelect,
    defaultSelectedValue: assetRateInterval?.value,
  });

  const { pickPhoto } = useImagePicker({
    onPickPhotoCallback: onSelectPhoto,
  });

  return (
    <View style={containerStyles.defaultPageStyle}>
      <ScrollView>
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
        <View style={{ ...(styles.inputContainer as object), zIndex: 50 }}>
          <Dropdown
            {...dropdownConditionProps}
            getSelectedOption={getSelectedCondition}
          />
        </View>
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
                value={assetStandardRate.value}
                onChangeText={assetStandardRate.onChange}
              />
              {errors.standardRate && (
                <Text style={textStyles.fieldError}>
                  {errors.standardRate.message}
                </Text>
              )}
            </View>
          </View>
          <View style={containerStyles.twoColumnCol}>
            <Text style={textStyles.fieldLabel}>Rate Interval</Text>
            <View style={styles.inputContainer}>
              <Dropdown
                {...dropdownRateIntervalProps}
                getSelectedOption={getSelectedRateInterval}
                optionsContainerMaxHeight={100}
              />
            </View>
          </View>
        </View>
        <Text style={textStyles.fieldLabel}>Picture</Text>
        {assetPhoto?.value ? (
          <View
            style={{
              ...(containerStyles.twoColumnRow as object),
              marginBottom: 16,
            }}
          >
            <View style={containerStyles.twoColumnCol}>
              <TouchableNativeFeedback onPress={pickPhoto}>
                <View
                  style={{
                    ...(containerStyles.centerAll as object),
                    ...(buttonStyles.uploadButton as object),
                  }}
                >
                  <Text style={{ ...(textStyles.buttonText as object) }}>
                    Replace Image
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={containerStyles.twoColumnCol}>
              <TouchableNativeFeedback onPress={removePhoto}>
                <View
                  style={{
                    ...(containerStyles.centerAll as object),
                    ...(buttonStyles.destructive as object),
                  }}
                >
                  <Text style={{ ...(textStyles.buttonText as object) }}>
                    Remove Image
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TouchableNativeFeedback onPress={pickPhoto}>
              <View
                style={{
                  ...(containerStyles.centerAll as object),
                  ...(buttonStyles.uploadButton as object),
                }}
              >
                <Text style={{ ...(textStyles.buttonText as object) }}>
                  Select Image
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        )}

        <View
          style={{
            ...(styles.inputContainer as object),
            ...(containerStyles.centerAll as object),
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
            ...(containerStyles.centerAll as object),
            ...(isSubmitting
              ? (buttonStyles.disabled as object)
              : (buttonStyles.cta as object)),
          }}
        >
          {isSubmitting ? (
            <Spinner style={styles.spinnerStyle} />
          ) : (
            <Text style={{ ...(textStyles.buttonText as object) }}>
              Confirm
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
