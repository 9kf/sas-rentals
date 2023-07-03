import { useEffect, useState } from "react";
import {
  IAssetFirebaseResponse,
  TAssetList,
  useAssetStore,
} from "../../assets";
import z from "zod/lib";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const rentalFormSchema = z.object({
  assetId: z.string().min(1, { message: "Field is requried" }),
  dateRange: z.string().min(1, { message: "Field is requried" }),
  customerName: z.string().min(1, { message: "Field is requried" }),
  contactNumbers: z.array(z.string()).min(1, { message: "Field is requried" }),
  address: z.string().min(1, { message: "Field is requried" }),
  standardRate: z.string().min(1, { message: "Field is requried" }),
  rateInterval: z.string(),
  mobilizationFee: z.string(),
  safetyDeposit: z.string(),
  expenses: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
  comments: z.string(),
});

export type RentalFormSchemaType = z.infer<typeof rentalFormSchema>;

export function useRentalForm() {
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RentalFormSchemaType>({
    resolver: zodResolver(rentalFormSchema),
  });

  const { field: assetId } = useController({
    control,
    defaultValue: "",
    name: "assetId",
  });

  const { field: dateRange } = useController({
    control,
    defaultValue: "",
    name: "dateRange",
  });

  const { field: customerName } = useController({
    control,
    defaultValue: "",
    name: "customerName",
  });

  const { field: contactNumbers } = useController({
    control,
    defaultValue: [],
    name: "contactNumbers",
  });

  const { field: address } = useController({
    control,
    defaultValue: "",
    name: "address",
  });

  const { field: standardRate } = useController({
    control,
    defaultValue: "",
    name: "standardRate",
  });

  const { field: rateInterval } = useController({
    control,
    defaultValue: "",
    name: "rateInterval",
  });

  const { field: mobilizationFee } = useController({
    control,
    defaultValue: "",
    name: "mobilizationFee",
  });

  const { field: safetyDeposit } = useController({
    control,
    defaultValue: "",
    name: "safetyDeposit",
  });

  const { field: expenses } = useController({
    control,
    defaultValue: [],
    name: "expenses",
  });

  const { field: comments } = useController({
    control,
    defaultValue: "",
    name: "comments",
  });

  const { assetDocument } = useAssetStore();

  const [assetList, setAssetList] = useState<TAssetList[]>([]);

  useEffect(() => {
    getAssets();
  }, []);

  async function getAssets() {
    const assets = await assetDocument.orderBy("createdDate", "asc").get();
    const newAssetList = assets.docs.map((doc) => {
      return { ...(doc.data() as IAssetFirebaseResponse), id: doc.id };
    }) as TAssetList[];

    setAssetList(newAssetList);
  }

  const onAssetSelect = (optionId: string) => {
    setValue("assetId", optionId);
  };

  const onRateIntervalSelect = (optionId: string) => {
    setValue("rateInterval", optionId);
  };

  const setRental: SubmitHandler<RentalFormSchemaType> = (data) => {
    console.log(data);
  };

  return {
    states: {
      assetList,
      assetId,
      dateRange,
      customerName,
      contactNumbers,
      address,
      standardRate,
      rateInterval,
      mobilizationFee,
      safetyDeposit,
      expenses,
      comments,
      errors,
      isSubmitting,
    },
    functions: {
      handleSubmit,
      setRental,
      onAssetSelect,
      onRateIntervalSelect,
    },
  };
}
