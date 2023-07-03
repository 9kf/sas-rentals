import { ImagePickerAsset } from "expo-image-picker";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { useAssetStore } from "../../../features/assets";
import { ASSET_STATUSES } from "../../../utils/contstants";
import { useState } from "react";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { useToast } from "../../../components";

const assetFormSchema = z.object({
  name: z.string().min(3, { message: "Field is required" }),
  description: z.string(),
  condition: z.string(),
  standardRate: z.string().min(1, { message: "Field is requried" }),
  rateInterval: z.string(),
  photo: z.string().nullable(),
});

export type AssetFormSchemaType = z.infer<typeof assetFormSchema>;

interface IUseAssetFormProps {
  name?: string;
  description?: string;
  condition?: string;
  standardRate?: string;
  rateInterval?: string;
  photo?: string;
}

export function useAssetForm(props?: IUseAssetFormProps) {
  const showToast = useToast((state) => state.showToast);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssetFormSchemaType>({
    resolver: zodResolver(assetFormSchema),
  });

  const {
    uploadAssetImage,
    addAsset: addAssetToStore,
    updateAsset: updateAssetToStore,
  } = useAssetStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { field: assetName } = useController({
    control,
    defaultValue: props?.name || "",
    name: "name",
  });

  const { field: assetDescription } = useController({
    control,
    defaultValue: props?.description || "",
    name: "description",
  });

  const { field: assetCondition } = useController({
    control,
    defaultValue: props?.condition || "",
    name: "condition",
  });

  const { field: assetStandardRate } = useController({
    control,
    defaultValue: props?.standardRate || "",
    name: "standardRate",
  });

  const { field: assetRateInterval } = useController({
    control,
    defaultValue: props?.rateInterval || "",
    name: "rateInterval",
  });

  const { field: assetPhoto } = useController({
    control,
    defaultValue: props?.photo || "",
    name: "photo",
  });

  const navigation = useNavigation<NavigationScreensType>();

  const addAsset: SubmitHandler<AssetFormSchemaType> = async (data) => {
    setIsSubmitting(true);
    if (data.photo) {
      await uploadAssetImage(data.photo, async (imgPath) => {
        const url = await storage().ref(imgPath).getDownloadURL();
        await addAssetToStore(
          {
            ...data,
            photoUrl: url,
            photoRef: imgPath,
            status: ASSET_STATUSES[0].id,
            lastCustomer: null,
            lastRentalSchedule: null,
            overallProfit: 0,
            createdDate: firestore.FieldValue.serverTimestamp(),
            modifiedDate: firestore.FieldValue.serverTimestamp(),
          },
          () => {
            showToast({
              title: "Success",
              message: "Asset has been added to the list.",
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
      });
    } else {
      await addAssetToStore(
        {
          ...data,
          status: ASSET_STATUSES[0].id,
          lastCustomer: null,
          lastRentalSchedule: null,
          overallProfit: 0,
          createdDate: firestore.FieldValue.serverTimestamp(),
          modifiedDate: firestore.FieldValue.serverTimestamp(),
        },
        () => {
          showToast({
            title: "Success",
            message: "Asset has been added to the list.",
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
    }
  };

  const updateAsset = async (data: AssetFormSchemaType, documentId: string) => {
    setIsSubmitting(true);
    if (data.photo && data.photo !== "") {
      await uploadAssetImage(data.photo, async (imgPath) => {
        const url = await storage().ref(imgPath).getDownloadURL();
        await updateAssetToStore(
          {
            ...data,
            photoUrl: url,
            photoRef: imgPath,
            modifiedDate: firestore.FieldValue.serverTimestamp(),
          },
          documentId,
          () => {
            showToast({
              title: "Success",
              message: "Asset has been updated.",
              type: "success",
            });
            setIsSubmitting(false);
            navigation.goBack();
          },
          (error) => {
            showToast({ title: "Error", message: error, type: "error" });
            setIsSubmitting(false);
          }
        );
      });
    } else {
      await updateAssetToStore(
        {
          ...data,
          photoRef: null,
          photoUrl: null,
          modifiedDate: firestore.FieldValue.serverTimestamp(),
        },
        documentId,
        () => {
          showToast({
            title: "Success",
            message: "Asset has been updated.",
            type: "success",
          });
          setIsSubmitting(false);
          navigation.goBack();
        },
        (error) => {
          showToast({ title: "Error", message: error, type: "error" });
          setIsSubmitting(false);
        }
      );
    }
  };

  const onConditionSelect = (optionId: string) => {
    setValue("condition", optionId);
  };

  const onRateIntervalSelect = (optionId: string) => {
    setValue("rateInterval", optionId);
  };

  const onSelectPhoto = (img: ImagePickerAsset) => {
    setValue("photo", img.uri);
  };

  const removePhoto = () => {
    setValue("photo", "");
  };

  return {
    states: {
      assetName,
      assetDescription,
      assetCondition,
      assetRateInterval,
      assetStandardRate,
      assetPhoto,
      isSubmitting,
      errors,
    },
    functions: {
      handleSubmit,
      addAsset,
      onConditionSelect,
      onRateIntervalSelect,
      onSelectPhoto,
      removePhoto,
      updateAsset,
    },
  };
}
