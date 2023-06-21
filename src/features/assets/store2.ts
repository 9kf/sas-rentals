import storage, { FirebaseStorageTypes } from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { AssetFormSchemaType } from "./hooks/useAssetForm";

export function useStore2() {
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

  async function addAsset(data: AssetFormSchemaType) {
    const doc = await assetDocument
      .add(data)
      .then((val) => {
        console.log("added successfully", val);
      })
      .catch((rejected) => {
        console.log(rejected);
      });
  }

  return {
    uploadAssetImage,
    addAsset,
  };
}
