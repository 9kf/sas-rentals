import { FlatList, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { FloatingActionButton } from "../../components";
import useTheme from "../../theme/useTheme";
import { AssetCard } from "../../features/assets";
import { useAssetList } from "../../features/assets/hooks/useAssetList";
import { RootStackParamsList } from "../../utils/types";
import * as Notifications from "expo-notifications";

export interface IAssetsProps {
  route: RouteProp<RootStackParamsList, "assets">;
  navigation: StackNavigationProp<RootStackParamsList, "assets">;
}

export default function Assets({ navigation }: IAssetsProps) {
  const { containerStyles, textStyles } = useTheme();
  const { assetList } = useAssetList();

  return (
    <View style={containerStyles.defaultPageStyle}>
      {assetList.length > 0 ? (
        <FlatList
          data={assetList}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 8 }} />}
          renderItem={({ item }) => <AssetCard {...item} />}
          keyExtractor={(item) => item.name}
        />
      ) : (
        <View style={containerStyles.verticalCenterAlign}>
          <Text style={textStyles.title}>No Assets</Text>
        </View>
      )}
      {/* <FloatingActionButton onClick={() => navigation.push("asset-form")} /> */}
      <FloatingActionButton
        onClick={async () => {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "You've got mail! 📬",
              body: "Here is the notification body",
              data: { data: "goes here" },
            },
            trigger: null,
          });
        }}
      />
    </View>
  );
}
