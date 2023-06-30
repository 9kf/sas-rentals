import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import useTheme from "../../theme/useTheme";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamsList } from "../../utils/types";
import { Modal } from "@ui-kitten/components";
import { useModal } from "../../utils/hooks";
import { useAssetDetails } from "../../features/assets";
import { IMAGE_PLACEHOLDER } from "../../utils/contstants";
import { useAssetStore } from "../../features/assets";

export default function AssetDetails() {
  const { buttonStyles, containerStyles, textStyles } = useTheme();

  const route = useRoute<RouteProp<RootStackParamsList, "asset-details">>();
  const {
    name,
    condition,
    description,
    rateInterval,
    standardRate,
    lastRentalSchedule,
    overallProfit,
    id,
  } = route.params.assetDetails;

  const { isVisible, onBackdropPress, showModal, toggleModal } = useModal();

  const {
    states: { assetDetails, isSubmitting },
    functions: { onDeleteAsset, navigateToEditAssetForm },
  } = useAssetDetails(id);

  const { getAssetConditionById, getAssetRateIntervalById } = useAssetStore();

  const assetRateInterval = getAssetRateIntervalById(
    assetDetails?.rateInterval || rateInterval
  );
  const assetCondition = getAssetConditionById(
    assetDetails?.condition || condition
  );

  return (
    <View style={containerStyles.defaultPageStyle}>
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image
            resizeMethod="scale"
            resizeMode="cover"
            source={{
              uri: assetDetails?.photoUrl || IMAGE_PLACEHOLDER,
              height: 100,
              width: 180,
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              ...(textStyles.largeTitle as object),
              marginBottom: 6,
            }}
          >
            {assetDetails?.name || name}
          </Text>
          <View
            style={{
              ...(containerStyles.rowCenterAlign as object),
              marginBottom: 6,
            }}
          >
            <Text style={textStyles.cardFieldLabel}>Rate: </Text>
            <Text
              style={{
                ...(textStyles.cardFieldValue as object),
                textTransform: "capitalize",
              }}
            >{`${assetDetails?.standardRate || standardRate} / ${
              assetRateInterval?.name
            }`}</Text>
          </View>
          <View
            style={{
              ...(containerStyles.rowCenterAlign as object),
              marginBottom: 6,
            }}
          >
            <Text style={textStyles.cardFieldLabel}>Condition: </Text>
            <Text
              style={{
                ...(textStyles.cardFieldValue as object),
                textTransform: "capitalize",
              }}
            >
              {assetCondition?.name}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={textStyles.cardFieldLabel}>Description: </Text>
        <Text
          style={{
            ...styles.detailValue,
            marginTop: 6,
          }}
        >
          {assetDetails?.description || description}
        </Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={textStyles.cardFieldLabel}>Last Rental: </Text>
        {!(assetDetails?.lastRentalSchedule || lastRentalSchedule) && (
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            Not yet rented
          </Text>
        )}
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={textStyles.cardFieldLabel}>Overall Profit: </Text>
        <Text
          style={{
            ...styles.detailValue,
            marginTop: 6,
          }}
        >
          {`${assetDetails?.overallProfit || overallProfit} Php`}
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableNativeFeedback
        onPress={() =>
          navigateToEditAssetForm(
            ({ ...assetDetails, id: route.params?.assetDetails?.id } as any) ||
              route.params?.assetDetails
          )
        }
      >
        <View
          style={{
            ...(containerStyles.centerAll as object),
            ...(buttonStyles.cta as object),
          }}
        >
          <Text style={textStyles.buttonText}>Edit</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={showModal}>
        <View
          style={{
            ...(containerStyles.centerAll as object),
            ...(buttonStyles.destructive as object),
            marginTop: 8,
          }}
        >
          <Text style={textStyles.buttonText}>Delete</Text>
        </View>
      </TouchableNativeFeedback>

      <Modal
        visible={isVisible}
        onBackdropPress={onBackdropPress}
        backdropStyle={containerStyles.defaultModalBackdrop}
      >
        <View style={containerStyles.defaultModalContainer}>
          <Text style={textStyles.modalTitle}>Confirmation</Text>
          <View style={{ marginVertical: 6 }} />
          <Text
            style={textStyles.modalDescription}
          >{`Do you really want to delete the asset ${
            assetDetails?.name || name
          }?`}</Text>
          <View style={{ marginVertical: 16 }} />
          <TouchableNativeFeedback
            onPress={() => onDeleteAsset(id)}
            disabled={isSubmitting}
          >
            <View
              style={{
                ...(containerStyles.centerAll as object),
                ...(isSubmitting
                  ? (buttonStyles.disabled as object)
                  : (buttonStyles.destructive as object)),
              }}
            >
              <Text style={textStyles.buttonText}>Confirm</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={toggleModal}
            disabled={isSubmitting}
          >
            <View
              style={{
                ...(containerStyles.centerAll as object),
                ...(isSubmitting
                  ? (buttonStyles.disabled as object)
                  : (buttonStyles.cancel as object)),
                marginTop: 8,
              }}
            >
              <Text style={textStyles.buttonText}>Cancel</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    flexBasis: "50%",
    overflow: "hidden",
    flexShrink: 0,
  },
  infoContainer: {
    flexBasis: "50%",
    paddingLeft: 20,
    justifyContent: "center",
  },
  detailValue: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 14,
    color: "#3D3D3D",
  },
});
