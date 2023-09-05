import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  ScrollView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Modal } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";

import useTheme from "../../theme/useTheme";
import { RootStackParamsList } from "../../utils/types";
import { useModal } from "../../utils/hooks";
import { useAssetDetails } from "../../features/assets";
import { IMAGE_PLACEHOLDER } from "../../utils/contstants";
import { useAssetService } from "../../features/assets";
import { useEffect } from "react";
import { HeaderActions } from "../../components";
import { RentalCard } from "../../features/scheduling";

export interface IAssetDetailsProps {
  route: RouteProp<RootStackParamsList, "asset-details">;
  navigation: StackNavigationProp<RootStackParamsList, "asset-details">;
}

export default function AssetDetails({
  route,
  navigation,
}: IAssetDetailsProps) {
  const { buttonStyles, containerStyles, textStyles } = useTheme();

  const {
    name,
    condition,
    description,
    dailyRate,
    overallProfit,
    id,
    weeklyRate,
    monthlyRate,
    yearlyRate,
  } = route.params.assetDetails;

  const { isVisible, onBackdropPress, showModal, toggleModal } = useModal();

  const {
    states: { assetDetails, isSubmitting, rentals },
    functions: { onDeleteAsset, navigateToEditAssetForm },
  } = useAssetDetails(id);

  const { getAssetConditionById } = useAssetService();

  const assetCondition = getAssetConditionById(
    assetDetails?.condition || condition
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderActions
          onPressEdit={() =>
            navigateToEditAssetForm(
              ({
                ...assetDetails,
                id: route.params?.assetDetails?.id,
              } as any) || route.params?.assetDetails
            )
          }
          onPressDelete={() =>
            navigation.push("confirm-delete-modal", {
              confirmationMessage:
                "Are you sure you want to delete this asset?",
              title: "Confirmation",
              onPressDelete: () => {
                onDeleteAsset(id);
              },
            })
          }
        />
      ),
    });
  }, []);

  return (
    <ScrollView style={containerStyles.defaultPageStyle}>
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
              ...textStyles.largeTitle,
              marginBottom: 6,
            }}
          >
            {assetDetails?.name || name}
          </Text>
          <View
            style={{
              ...containerStyles.rowCenterAlign,
              marginBottom: 6,
            }}
          >
            <Text style={textStyles.cardFieldLabel}>Overall Profit: </Text>
            <Text
              style={{
                ...textStyles.cardFieldValue,
                textTransform: "capitalize",
              }}
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "PHP",
              }).format(overallProfit || 0)}
            </Text>
          </View>
          <View
            style={{
              ...containerStyles.rowCenterAlign,
              marginBottom: 6,
            }}
          >
            <Text style={textStyles.cardFieldLabel}>Condition: </Text>
            <Text
              style={{
                ...textStyles.cardFieldValue,
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

      <Text style={{ ...textStyles.formSection, marginTop: 24 }}>Rates</Text>

      <View style={{ marginTop: 8 }}>
        <Text style={textStyles.cardFieldLabel}>Daily rate: </Text>
        <Text
          style={{
            ...styles.detailValue,
            marginTop: 6,
          }}
        >
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "PHP",
          }).format(parseFloat(dailyRate) || 0)}
        </Text>
      </View>

      {weeklyRate && weeklyRate !== "" && (
        <View style={{ marginTop: 8 }}>
          <Text style={textStyles.cardFieldLabel}>Weekly rate: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(parseFloat(weeklyRate) || 0)}
          </Text>
        </View>
      )}

      {monthlyRate && monthlyRate !== "" && (
        <View style={{ marginTop: 8 }}>
          <Text style={textStyles.cardFieldLabel}>Monthly rate: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(parseFloat(monthlyRate) || 0)}
          </Text>
        </View>
      )}

      {yearlyRate && yearlyRate !== "" && (
        <View style={{ marginTop: 8 }}>
          <Text style={textStyles.cardFieldLabel}>Yearly rate: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(parseFloat(yearlyRate) || 0)}
          </Text>
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <Text style={textStyles.formSection}>Recent Rentals: </Text>
      </View>

      <View style={{ marginTop: 8, marginBottom: 16 }}>
        {rentals.map((rental) => (
          <RentalCard
            key={rental.id}
            {...rental}
            onClickCard={() =>
              navigation.push("rental-details", {
                rentalDetails: rental,
              })
            }
          />
        ))}
      </View>
    </ScrollView>
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
