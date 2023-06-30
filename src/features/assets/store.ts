import storage from "@react-native-firebase/storage";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { AssetFormSchemaType } from "./hooks/useAssetForm";
import {
  ASSET_STATUSES,
  CONDITION_OPTIONS,
  RATE_INTERVAL_OPTIONS,
} from "../../utils/contstants";

export function useAssetStore() {
  const assetDocument = firestore().collection("Assets");

  async function uploadAssetImage(
    imgUri: string,
    onSuccessCallback?: (imgPath: string) => void,
    onErrorCallback?: (errMessage: string) => void
  ) {
    const filename = imgUri.substring(imgUri.lastIndexOf("/") + 1);
    const reference = storage().ref(filename);
    // uploads file
    const task = await reference.putFile(imgUri);

    if (task.state === "error") {
      onErrorCallback?.(
        `[${task.error?.code}]: task.error?.message (${task.error?.cause})` ||
          ""
      );
      return;
    }

    onSuccessCallback?.(task.metadata.fullPath);
  }

  async function addAsset(
    data: Omit<AssetFormSchemaType, "photo"> & {
      status: string;
      lastCustomer: string | null;
      lastRentalSchedule: string | null;
      overallProfit: number;
      createdDate: FirebaseFirestoreTypes.FieldValue;
      modifiedDate: FirebaseFirestoreTypes.FieldValue;
      photoRef?: string;
      photoUrl?: string;
    },
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void
  ) {
    const doc = await assetDocument
      .add(data)
      .then((val) => {
        onSuccessCallback?.();
      })
      .catch((rejected) => {
        onErrorCallback?.(rejected);
      });
  }

  async function updateAsset(
    data: Omit<AssetFormSchemaType, "photo"> & {
      // status: string;
      // lastCustomer: string | null;
      // lastRentalSchedule: string | null;
      // overallProfit: number;
      modifiedDate: FirebaseFirestoreTypes.FieldValue;
      photoRef: string | null;
      photoUrl: string | null;
    },
    documentId: string,
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void
  ) {
    await assetDocument
      .doc(documentId)
      .update(data)
      .then(() => {
        onSuccessCallback?.();
      })
      .catch((rejected) => {
        onErrorCallback?.(rejected);
      });
  }

  async function deleteAsset(
    documentId: string,
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void
  ) {
    await assetDocument
      .doc(documentId)
      .delete()
      .then(() => {
        onSuccessCallback?.();
      })
      .catch((rejected) => {
        onErrorCallback?.(rejected);
      });
  }

  function getAssetStatusById(statusId: string) {
    return ASSET_STATUSES.find((status) => status.id === statusId);
  }

  function getAssetRateIntervalById(rateIntervalId: string) {
    return RATE_INTERVAL_OPTIONS.find(
      (interval) => interval.id === rateIntervalId
    );
  }

  function getAssetConditionById(conditionId: string) {
    return CONDITION_OPTIONS.find((condition) => condition.id === conditionId);
  }

  return {
    assetDocument,
    uploadAssetImage,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetStatusById,
    getAssetRateIntervalById,
    getAssetConditionById,
  };
}
