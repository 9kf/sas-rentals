import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

interface IUseImagePickerProps {
  onPickPhotoCallback?: (img: ImagePicker.ImagePickerAsset) => void;
  onCancelCallback?: () => void;
}

export function useImagePicker({
  onPickPhotoCallback,
  onCancelCallback,
}: IUseImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);

  async function pickPhoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      onCancelCallback?.();
      return;
    }

    setImage(result.assets[0].uri);
    onPickPhotoCallback?.(result.assets[0]);
  }

  return {
    image,
    pickPhoto,
  };
}
