import { useEffect, useState } from "react";
import {
  IAssetFirebaseResponse,
  TAssetList,
  useAssetService,
} from "../../assets";
import z from "zod/lib";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListKeyValueSchemaType } from "../../../components/list-key-value/useListKeyValue";
import format from "date-fns/format";
import { useRentalSchedulingService } from "../service";
import { useToast } from "../../../components";
import { useNavigation } from "@react-navigation/native";
import { NavigationScreensType } from "../../../utils/types";
import { IRentalScheduleFirebaseResponse } from "../types";
import { getDatesInRange } from "../helpers";
import { TCustomer, useCustomerService } from "../../customers";

const rentalFormSchema = z
  .object({
    id: z.string().optional(),
    assetId: z.string().min(1, { message: "Field is requried" }),
    assetName: z.string().nullable(),
    assetColor: z.string().nullable(),
    startDate: z.string().min(1, { message: "Field is requried" }),
    endDate: z.string().min(1, { message: "Field is requried" }),
    customerName: z.string().min(1, { message: "Field is requried" }),
    contactNumbers: z.array(z.string()),
    address: z.string().min(1, { message: "Field is requried" }),
    dailyRate: z.string().min(1, { message: "Field is requried" }),
    weeklyRate: z.string().nullable(),
    monthlyRate: z.string().nullable(),
    yearlyRate: z.string().nullable(),
    rateInterval: z.string(),
    includeSundays: z.boolean(),
    mobilizationFee: z.string(),
    safetyDeposit: z.string(),
    expenses: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    ),
    comments: z.string(),
    isEditing: z.boolean().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.rateInterval === "2" && val.weeklyRate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        message: "Field is required",
        path: ["weeklyRate"],
        inclusive: true,
        fatal: true,
      });

      return z.NEVER;
    }

    if (val.rateInterval === "3" && val.monthlyRate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        message: "Field is required",
        path: ["monthlyRate"],
        inclusive: true,
        fatal: true,
      });

      return z.NEVER;
    }

    if (val.rateInterval === "4" && val.yearlyRate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        message: "Field is required",
        path: ["yearlyRate"],
        inclusive: true,
        fatal: true,
      });

      return z.NEVER;
    }
  });

export type RentalFormSchemaType = z.infer<typeof rentalFormSchema>;

const DATE_FORMAT = "yyyy-MM-dd";

export function useRentalForm() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset,
  } = useForm<RentalFormSchemaType>({
    defaultValues: {
      isEditing: false,
    },
    resolver: zodResolver(rentalFormSchema),
  });

  const { field: assetId } = useController({
    control,
    defaultValue: "",
    name: "assetId",
  });
  const { field: assetName } = useController({
    control,
    defaultValue: "",
    name: "assetName",
  });

  const { field: assetColor } = useController({
    control,
    defaultValue: "",
    name: "assetColor",
  });

  const { field: startDate } = useController({
    control,
    defaultValue: format(new Date(), DATE_FORMAT),
    name: "startDate",
  });

  const { field: endDate } = useController({
    control,
    defaultValue: format(new Date(), DATE_FORMAT),
    name: "endDate",
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

  const { field: rateInterval } = useController({
    control,
    defaultValue: "",
    name: "rateInterval",
  });

  const { field: includeSundays } = useController({
    control,
    defaultValue: false,
    name: "includeSundays",
  });

  const { field: dailyRate } = useController({
    control,
    defaultValue: "",
    name: "dailyRate",
  });

  const { field: weeklyRate } = useController({
    control,
    defaultValue: "",
    name: "weeklyRate",
  });

  const { field: monthlyRate } = useController({
    control,
    defaultValue: "",
    name: "monthlyRate",
  });

  const { field: yearlyRate } = useController({
    control,
    defaultValue: "",
    name: "yearlyRate",
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

  const { assetDocument } = useAssetService();
  const { customerDocument } = useCustomerService();
  const { rentalScheduleDocument, scheduleRental } =
    useRentalSchedulingService();
  const navigation = useNavigation<NavigationScreensType>();
  const showToast = useToast((state) => state.showToast);

  const [assetList, setAssetList] = useState<TAssetList[]>([]);
  const [customerList, setCustomerList] = useState<TCustomer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAssets();
    getCustomers();
  }, []);

  async function getAssets() {
    const assets = await assetDocument.orderBy("createdDate", "asc").get();
    const newAssetList = assets.docs.map((doc) => {
      return { ...(doc.data() as IAssetFirebaseResponse), id: doc.id };
    }) as TAssetList[];

    setAssetList(newAssetList);
  }

  async function getCustomers() {
    const customers = await customerDocument.orderBy("name", "asc").get();
    const newCustomerList = customers.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as TCustomer[];

    setCustomerList(newCustomerList);
  }

  function onAssetSelect(
    optionId: string,
    selectRateInterval: (id: string) => void
  ) {
    const asset = assetList.find((asset) => asset.id === optionId);

    // prefill the fields based on the selected asset properties that matches the field labels
    setValue("assetId", optionId);
    setValue("assetName", asset?.name || "");
    setValue("assetColor", asset?.color || "");
    setValue("dailyRate", asset?.dailyRate || "");
    setValue("weeklyRate", asset?.weeklyRate || "");
    setValue("monthlyRate", asset?.monthlyRate || "");
    setValue("yearlyRate", asset?.yearlyRate || "");

    selectRateInterval(asset?.standardRateInterval || "1");

    validateRentalDates();
  }

  const onRateIntervalSelect = (optionId: string) => {
    setValue("rateInterval", optionId);
  };

  const onToggleIncludeSundays = (isChecked: boolean) => {
    setValue("includeSundays", isChecked);
  };

  function onAddContactNumber(newValues: string[]) {
    setValue("contactNumbers", newValues);
  }

  function onRemoveContactNumber(newValues: string[]) {
    setValue("contactNumbers", newValues);
  }

  function onAddExpenses(newValues: ListKeyValueSchemaType[]) {
    setValue("expenses", newValues);
  }

  function onRemoveExpenses(newValues: ListKeyValueSchemaType[]) {
    setValue("expenses", newValues);
  }

  function onChangeStartDate(date: Date) {
    setValue("startDate", format(date, DATE_FORMAT));

    validateRentalDates();
  }

  function onChangeEndDate(date: Date) {
    setValue("endDate", format(date, DATE_FORMAT));

    validateRentalDates();
  }

  function onSelectCustomerOption(customer: TCustomer) {
    setValue("contactNumbers", customer.contactNumbers);
    setValue("customerName", customer.name);
    setValue("address", customer.address);
  }

  async function validateRentalDates() {
    clearErrors("startDate");

    const { assetId, isEditing, startDate, endDate } = getValues();

    if (
      assetId &&
      assetId !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      !isEditing
    ) {
      const rentalDocs = await rentalScheduleDocument
        .where("asset.id", "==", assetId)
        .get();

      for (const doc of rentalDocs.docs) {
        const typedData = doc.data() as IRentalScheduleFirebaseResponse;

        const docDatesInRange = getDatesInRange(
          typedData.startDate.toDate(),
          typedData.endDate.toDate()
        ).map((date) => format(date, "yyyy-MM-dd"));

        const rentalDatesInRange = getDatesInRange(
          new Date(startDate),
          new Date(endDate)
        ).map((date) => format(date, "yyyy-MM-dd"));

        const isOverlapping = docDatesInRange.some(
          (r) => rentalDatesInRange.indexOf(r) >= 0
        );

        if (isOverlapping) {
          setError("startDate", {
            message: "The asset has an overlapping date of rental.",
          });
          break;
        }
      }
    }
  }

  const setRental: SubmitHandler<RentalFormSchemaType> = (data) => {
    setIsSubmitting(true);
    scheduleRental(
      data,
      () => {
        showToast({
          title: "Success",
          message: "Rental Schedule has been set",
          type: "success",
        });
        setIsSubmitting(false);
        navigation.navigate("schedules");
      },
      (error) => {
        showToast({ title: "Error", message: error, type: "error" });
        setIsSubmitting(false);
      },
      data.id
    );
  };

  function preloadFields(fields: IRentalScheduleFirebaseResponse) {
    reset({
      ...(fields.rateInterval === "2" && {
        weeklyRate: fields.rate.toString(),
      }),
      ...(fields.rateInterval === "3" && {
        monthlyRate: fields.rate.toString(),
      }),
      ...(fields.rateInterval === "4" && {
        yearlyRate: fields.rate.toString(),
      }),
      mobilizationFee: fields.mobilizationFee.toString(),
      safetyDeposit: fields.safetyDeposit.toString(),
      comments: fields.comments,
      address: fields.address,
      assetName: fields.asset.name,
      assetColor: fields.asset.color,
      assetId: fields.asset.id,
      contactNumbers: fields.customer.contactNumbers,
      customerName: fields.customer.name,
      dailyRate: fields.dailyRate.toString(),
      expenses: fields.expenses,
      includeSundays: fields.includeSundays,
      rateInterval: fields.rateInterval,
      startDate: format(fields.startDate.toDate(), DATE_FORMAT),
      endDate: format(fields.endDate.toDate(), DATE_FORMAT),
      isEditing: true,
      id: fields.id,
    });
  }

  function preloadCustomerFields(fields: TCustomer) {
    reset({
      address: fields.address,
      contactNumbers: fields.contactNumbers,
      customerName: fields.name,
    });
  }

  return {
    states: {
      assetList,
      customerList,
      assetId,
      assetName,
      assetColor,
      startDate,
      endDate,
      customerName,
      contactNumbers,
      address,
      rateInterval,
      includeSundays,
      dailyRate,
      weeklyRate,
      monthlyRate,
      yearlyRate,
      mobilizationFee,
      safetyDeposit,
      expenses,
      comments,
      errors,
      isSubmitting,
      isValid,
      DATE_FORMAT,
    },
    functions: {
      handleSubmit,
      setRental,
      onAssetSelect,
      onRateIntervalSelect,
      onAddContactNumber,
      onRemoveContactNumber,
      onAddExpenses,
      onRemoveExpenses,
      onChangeStartDate,
      onChangeEndDate,
      onToggleIncludeSundays,
      onSelectCustomerOption,
      preloadFields,
      preloadCustomerFields,
    },
  };
}
