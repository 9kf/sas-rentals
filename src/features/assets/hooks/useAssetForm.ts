import { ImagePickerAsset } from "expo-image-picker";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAssetStore } from "../store";
import { useNavigation } from "@react-navigation/native";
import routes from "../../../utils/routes";
import { NavigationScreensType } from "../../../utils/types";
import { Platform } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { DOCUMENTS } from "../../../utils/contstants";

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
  const assetsCollection = firestore().collection(DOCUMENTS.assets);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssetFormSchemaType>({
    resolver: zodResolver(assetFormSchema),
  });

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

  const addAssetToStore = useAssetStore((state) => state.addAsset);

  const addAsset: SubmitHandler<AssetFormSchemaType> = async (data) => {
    // const response = addAssetToStore(data as Required<AssetFormSchemaType>);
    // if (!response.isSuccess) {
    //   return;
    // }
    // navigation.navigate("assets");

    console.log("adding");
    const doc = await assetsCollection.add(data);
    console.log(doc);
  };

  const onConditionSelect = (optionId: string) => {
    setValue("condition", optionId);
  };

  const onRateIntervalSelect = (optionId: string) => {
    setValue("rateInterval", optionId);
  };

  const onSelectPhoto = (img: ImagePickerAsset) => {
    const filename = img.uri.substring(img.uri.lastIndexOf("/") + 1);
    const uploadUri =
      Platform.OS === "ios" ? img.uri.replace("file://", "") : img.uri;

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
