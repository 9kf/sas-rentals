import { ImagePickerAsset } from "expo-image-picker";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAssetStore } from "../store";
import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { useStore2 } from "../../../features/assets/store2";

const assetFormSchema = z.object({
  name: z.string().min(3, { message: "Field is required" }),
  description: z.string(),
  condition: z.string(),
  standardRate: z.string().min(1, { message: "Field is requried" }),
  rateInterval: z.string(),
  photo: z.string(),
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

export default function useAssetForm(props?: IUseAssetFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssetFormSchemaType>({
    resolver: zodResolver(assetFormSchema),
  });

  const { uploadAssetImage, addAsset: addAssetToStore } = useStore2();

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
    uploadAssetImage(data.photo, async (imgPath) => {
      const doc = await addAssetToStore({ ...data, photo: imgPath });
      navigation.navigate("assets");
    });
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

  return {
    states: {
      assetName,
      assetDescription,
      assetCondition,
      assetRateInterval,
      assetStandardRate,
      assetPhoto,
    },
    functions: {
      handleSubmit,
      addAsset,
      onConditionSelect,
      onRateIntervalSelect,
      onSelectPhoto,
    },
  };
}
