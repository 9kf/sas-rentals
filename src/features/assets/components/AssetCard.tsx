import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import useTheme from "../../../theme/useTheme";
import { IAssetFirebaseResponse } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { useAssetService } from "../../assets";
import { IMAGE_PLACEHOLDER } from "../../../utils/contstants";

interface IAssetCardProps extends IAssetFirebaseResponse {
  id: string;
}

export default function AssetCard(props: IAssetCardProps) {
  const { name, condition, photoUrl, dailyRate, status, color, overallProfit } =
    props;

  const { containerStyles, textStyles } = useTheme();
  const navigation = useNavigation<NavigationScreensType>();
  const { getAssetConditionById, getAssetStatusById } = useAssetService();

  const assetStatus = getAssetStatusById(status);
  const assetCondition = getAssetConditionById(condition);

  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.push("asset-details", {
          assetDetails: {
            ...props,
          },
        })
      }
    >
      <View
        style={{
          ...containerStyles.cardContainer,
          backgroundColor: "white",
        }}
      >
        <AssetCardRibbon {...assetStatus} />
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMethod="scale"
              resizeMode="cover"
              source={{
                uri: photoUrl || IMAGE_PLACEHOLDER,
                height: 100,
                width: 140,
              }}
            />
          </View>
          <View style={styles.infoContainer}>
            <View
              style={{
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text style={textStyles.cardTitle}>{name}</Text>
              <View
                style={{
                  backgroundColor: color,
                  borderRadius: 9999,
                  height: 12,
                  width: 12,
                }}
              />
            </View>
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
      </View>
    </TouchableNativeFeedback>
  );
}

function AssetCardRibbon(props: { id?: string; name?: string }) {
  return <View style={styles.idleRibbon} />;
}

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    flexBasis: "40%",
    marginRight: 20,
    overflow: "hidden",
    flexShrink: 0,
  },
  infoContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  idleRibbon: {
    position: "absolute",
    height: 9999,
    width: 24,
    backgroundColor: "green",
    right: 0,
  },
  rentedRibbon: {
    position: "absolute",
    height: 9999,
    width: 24,
    backgroundColor: "#933A07",
    right: 0,
  },
});
