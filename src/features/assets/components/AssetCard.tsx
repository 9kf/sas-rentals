import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import useTheme from "../../../theme/useTheme";
import { IAsset, IAssetStatus } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";

interface IAssetCardProps extends IAsset {}

export default function AssetCard(props: IAssetCardProps) {
  const { name, condition, photo, rateInterval, standardRate, status } = props;

  const { containerStyles, textStyles } = useTheme();
  const navigation = useNavigation<NavigationScreensType>();

  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.push("asset-details", {
          assetDetails: { ...props },
        })
      }
    >
      <View
        style={{
          ...(containerStyles.cardContainer as object),
          backgroundColor: "white",
        }}
      >
        <AssetCardRibbon {...status} />
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMethod="scale"
              resizeMode="cover"
              source={{
                uri: photo || "https://cdn2.thecatapi.com/images/6tv.jpg",
                height: 100,
                width: 140,
              }}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text
              style={{ ...(textStyles.cardTitle as object), marginBottom: 6 }}
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
      </View>
    </TouchableNativeFeedback>
  );
}

function AssetCardRibbon({ id, name }: IAssetStatus) {
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
