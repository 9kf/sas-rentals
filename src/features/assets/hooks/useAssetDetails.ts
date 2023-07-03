import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { IAssetFirebaseResponse } from "../types";
import { useEffect, useState } from "react";
import { useAssetStore } from "../store";
import { useToast } from "../../../components";

export function useAssetDetails(assetId: string) {
  const showToast = useToast((state) => state.showToast);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assetDetails, setAssetDetails] = useState<
    undefined | (IAssetFirebaseResponse & { id: string })
  >(undefined);

  const navigation = useNavigation<NavigationScreensType>();
  const { assetDocument, deleteAsset } = useAssetStore();

  useEffect(() => {
    const subscriber = assetDocument.doc(assetId).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        setAssetDetails(
          snapshot.data() as IAssetFirebaseResponse & { id: string }
        );
      }
    });

    return () => subscriber();
  }, [assetId]);

  const onDeleteAsset = async (documentId: string) => {
    setIsSubmitting(true);
    await deleteAsset(
      documentId,
      () => {
        showToast({
          title: "Success",
          message: "Asset has been deleted.",
          type: "success",
        });
        setIsSubmitting(false);
        navigation.navigate("assets");
      },
      (error) => {
        showToast({ title: "Error", message: error, type: "error" });
        setIsSubmitting(false);
      }
    );
  };

  const navigateToEditAssetForm = (
    asset: IAssetFirebaseResponse & { id: string }
  ) => {
    navigation.navigate("asset-form", {
      isEditing: true,
      assetDetails: asset,
    });
  };

  return {
    states: {
      assetDetails,
      isSubmitting,
    },
    functions: {
      onDeleteAsset,
      navigateToEditAssetForm,
    },
  };
}
