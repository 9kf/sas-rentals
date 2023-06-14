import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { useModal } from "../../../utils/hooks";
import { useAssetStore } from "../store";
import { IAsset } from "../types";

export default function useAssetDetails() {
  const navigation = useNavigation<NavigationScreensType>();

  const deleteAsset = useAssetStore((state) => state.deleteAsset);

  const onDeleteAsset = (assetName: string) => {
    const response = deleteAsset(assetName);

    if (!response.isSuccess) {
      return;
    }

    navigation.navigate("assets");
  };

  const navigateToEditAssetForm = (asset: IAsset) => {
    navigation.navigate("asset-form", {
      isEditing: true,
      assetDetails: asset,
    });
  };

  return {
    onDeleteAsset,
    navigateToEditAssetForm,
  };
}
