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

export default function AssetDetails() {
  const { buttonStyles, containerStyles, textStyles } = useTheme();

  const route = useRoute<RouteProp<RootStackParamsList, "asset-details">>();
  const {
    name,
    condition,
    description,
    photo,
    rateInterval,
    standardRate,
    lastRentalSchedule,
    overallProfit,
  } = route.params.assetDetails;

  const { isVisible, onBackdropPress, showModal, toggleModal } = useModal();

  const { onDeleteAsset, navigateToEditAssetForm } = useAssetDetails();

  return (
    <View style={containerStyles.defaultPageStyle}>
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image
            resizeMethod="scale"
            resizeMode="cover"
            source={{
              uri: photo || "https://cdn2.thecatapi.com/images/6tv.jpg",
              height: 100,
              width: 180,
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text
            style={{
              ...(textStyles.largeTitle as object),
              marginBottom: 6,
            }}
          >
            {name}
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
            >{`${standardRate} / ${rateInterval.name}`}</Text>
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
              {condition.name}
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
          {description}
        </Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={textStyles.cardFieldLabel}>Last Rental: </Text>
        {!lastRentalSchedule && (
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
          {`${overallProfit} Php`}
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableNativeFeedback
        onPress={() => navigateToEditAssetForm(route.params?.assetDetails)}
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
          >{`Do you really want to delete the asset ${name}?`}</Text>
          <View style={{ marginVertical: 16 }} />
          <TouchableNativeFeedback onPress={() => onDeleteAsset(name)}>
            <View
              style={{
                ...(containerStyles.centerAll as object),
                ...(buttonStyles.destructive as object),
              }}
            >
              <Text style={textStyles.buttonText}>Confirm</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={toggleModal}>
            <View
              style={{
                ...(containerStyles.centerAll as object),
                ...(buttonStyles.cancel as object),
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
    marginRight: 20,
    overflow: "hidden",
    flexShrink: 0,
  },
  infoContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  detailValue: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 14,
    color: "#3D3D3D",
  },
});
