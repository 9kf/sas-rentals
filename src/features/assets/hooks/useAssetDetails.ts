import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { IAssetFirebaseResponse } from "../types";
import { useEffect, useState } from "react";
import { useAssetService } from "../service";
import { useToast } from "../../../components";
import { useRentalSchedulingService } from "../../scheduling/service";
import { IRentalScheduleFirebaseResponse } from "../../scheduling/types";

export function useAssetDetails(assetId: string) {
  const showToast = useToast((state) => state.showToast);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rentals, setRentals] = useState<IRentalScheduleFirebaseResponse[]>([]);

  const [assetDetails, setAssetDetails] = useState<
    undefined | (IAssetFirebaseResponse & { id: string })
  >(undefined);

  const navigation = useNavigation<NavigationScreensType>();
  const { assetDocument, deleteAsset } = useAssetService();
  const { getRentalByAssetId } = useRentalSchedulingService();

  useEffect(() => {
    getAssetRentals();
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

  async function getAssetRentals() {
    const response = await getRentalByAssetId(assetId);
    if (response) {
      const responseCopy = [];
      for (const doc of response.docs) {
        responseCopy.push({
          ...doc.data(),
          id: doc.id,
        } as IRentalScheduleFirebaseResponse);
      }

      setRentals(responseCopy);
    }
  }

  return {
    states: {
      assetDetails,
      isSubmitting,
      rentals,
    },
    functions: {
      onDeleteAsset,
      navigateToEditAssetForm,
    },
  };
}
