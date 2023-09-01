import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import format from "date-fns/format";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInBusinessDays from "date-fns/differenceInBusinessDays";

import { RootStackParamsList } from "../../utils/types";
import useTheme from "../../theme/useTheme";
import { IAssetFirebaseResponse, useAssetService } from "../../features/assets";
import { IMAGE_PLACEHOLDER } from "../../utils/contstants";
import { HeaderActions, useToast } from "../../components";
import { useRentalSchedulingService } from "../../features/scheduling/service";

export interface IRentalDetailsProps {
  route: RouteProp<RootStackParamsList, "rental-details">;
  navigation: StackNavigationProp<RootStackParamsList, "rental-details">;
}

export default function RentalDetails({
  navigation,
  route,
}: IRentalDetailsProps) {
  const {
    params: { rentalDetails },
  } = route;

  const { containerStyles, textStyles } = useTheme();
  const { getAssetById, getAssetConditionById, getAssetRateIntervalById } =
    useAssetService();
  const { deleteRental } = useRentalSchedulingService();
  const showToast = useToast((state) => state.showToast);

  const [asset, setAsset] = useState<IAssetFirebaseResponse | undefined>(
    undefined
  );
  const [isFetchingAsset, setIsFetchingAsset] = useState(false);

  const rateInterval = getAssetRateIntervalById(rentalDetails.rateInterval);

  async function getAssetDetails() {
    setIsFetchingAsset(true);
    const assetDetails = await getAssetById(rentalDetails.asset.id);
    if (assetDetails) {
      setAsset(assetDetails);
    }
    setIsFetchingAsset(false);
  }

  useEffect(() => {
    getAssetDetails();
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderActions
            onPressEdit={() =>
              navigation.push("rental-form", {
                isEditing: true,
                rentalDetails: route.params.rentalDetails,
              })
            }
            onPressDelete={() =>
              navigation.push("confirm-delete-modal", {
                confirmationMessage:
                  "Are you sure you want to delete this rental?",
                title: "Confirmation",
                onPressDelete: () => {
                  deleteRental(
                    route.params.rentalDetails.id || "",
                    () => {
                      showToast({
                        title: "Success",
                        message: "Rental has been deleted.",
                        type: "success",
                      });
                      navigation.popToTop();
                    },
                    (error) => {
                      showToast({
                        title: "Error",
                        message: error,
                        type: "error",
                      });
                      navigation.popToTop();
                    }
                  );
                },
              })
            }
          />
        );
      },
    });
  }, [navigation]);

  return (
    <View style={containerStyles.defaultPageStyle}>
      <ScrollView>
        {!isFetchingAsset && (
          <View style={{ flexDirection: "row" }}>
            <View style={styles.imageContainer}>
              <Image
                resizeMethod="scale"
                resizeMode="cover"
                source={{
                  uri: asset?.photoUrl || IMAGE_PLACEHOLDER,
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
                {rentalDetails.asset.name}
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
                  }).format(asset?.overallProfit || 0)}
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
                  {asset?.condition &&
                    getAssetConditionById(asset.condition)?.name}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ marginTop: 24 }}>
          <Text style={textStyles.cardFieldLabel}>Date: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {`${format(
              rentalDetails.startDate.toDate(),
              "MMMM dd, yyyy"
            )} - ${format(rentalDetails.endDate.toDate(), "MMMM dd, yyyy")} (${
              rentalDetails.includeSundays
                ? differenceInCalendarDays(
                    rentalDetails.endDate.toDate(),
                    rentalDetails.startDate.toDate()
                  ) + 1
                : differenceInBusinessDays(
                    rentalDetails.endDate.toDate(),
                    rentalDetails.startDate.toDate()
                  ) + 1
            } days)`}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Rate: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {`${new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(rentalDetails.dailyRate)} / Day`}
          </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {`${new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(rentalDetails.rate)} / ${rateInterval?.name} ${
              rentalDetails.includeSundays ? "(Includes Sundays)" : ""
            }`}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Mobilization Fee: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {`${new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(rentalDetails.mobilizationFee)}`}
          </Text>
        </View>

        {rentalDetails.expenses.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ ...textStyles.cardFieldLabel, marginBottom: 4 }}>
              Expenses:{" "}
            </Text>
            {rentalDetails.expenses.map((expense, index) => (
              <View
                key={index}
                style={{ ...containerStyles.rowCenterAlign, marginTop: 2 }}
              >
                <Text
                  style={{
                    ...styles.detailValue,
                    marginRight: 6,
                  }}
                >
                  {expense.name}:
                </Text>

                <Text style={styles.detailValue}>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "PHP",
                  }).format(parseFloat(expense.value))}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Expected Payment: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(rentalDetails.expectedPayment)}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Net Profit: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(rentalDetails.netProfit)}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Payment Status: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {rentalDetails.paymentStatus.name}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Rental Status: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {rentalDetails.rentalStatus.name}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={textStyles.cardFieldLabel}>Safety Deposit: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "PHP",
            }).format(rentalDetails.safetyDeposit)}
          </Text>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={textStyles.formSection}>Customer Information </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={textStyles.cardFieldLabel}>Name: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {rentalDetails.customer.name}
          </Text>
        </View>

        {rentalDetails.customer.contactNumbers?.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={textStyles.cardFieldLabel}>Contact Number(s): </Text>
            {rentalDetails.customer.contactNumbers?.map((number, index) => (
              <Text
                key={index}
                style={{
                  ...styles.detailValue,
                  marginTop: 6,
                }}
              >
                {number}
              </Text>
            ))}
          </View>
        )}

        <View style={{ marginTop: 12 }}>
          <Text style={textStyles.cardFieldLabel}>Address: </Text>
          <Text
            style={{
              ...styles.detailValue,
              marginTop: 6,
            }}
          >
            {rentalDetails.address}
          </Text>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={textStyles.formSection}>Comments</Text>
        </View>

        <Text
          style={{
            ...styles.detailValue,
            marginTop: 12,
          }}
        >
          {rentalDetails.comments}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    textTransform: "capitalize",
  },
});
