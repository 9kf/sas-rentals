import { FloatingActionButton } from "../../components";
import routes from "../../utils/routes";
import { FlatList, Text, View } from "react-native";
import useTheme from "../../theme/useTheme";
import { AssetCard } from "../../features/assets";
import useAssetList from "../../features/assets/hooks/useAssetList";

export default function Assets({ navigation }) {
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
      <FloatingActionButton onClick={() => navigation.push(routes.assetForm)} />
    </View>
  );
}
