import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { z } from "zod";

import { TCustomer } from "../types";
import { ICustomerModalProps } from "../../../screens/modals/CustomerModal";
import { useMemo, useState } from "react";
import { useToast } from "../../../components";
import { useCustomerService } from "../service";

const customerFormSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  contactNumbers: z.array(z.string()).optional(),
});

export type TCustomerFormSchemaType = z.infer<typeof customerFormSchema>;

export function useCustomerModal(props: ICustomerModalProps) {
  const { navigation, route } = props;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TCustomerFormSchemaType>({
    resolver: zodResolver(customerFormSchema),
  });

  const { addCustomer, updateCustomer } = useCustomerService();

  const showToast = useToast((state) => state.showToast);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const CTAText = useMemo(() => {
    if (route.params?.isUpdate) {
      if (isSubmitting) {
        return "Updating";
      }

      return "Update";
    }

    if (isSubmitting) {
      return "Adding";
    }

    return "Add";
  }, [isSubmitting]);

  const { field: name } = useController({
    control,
    defaultValue: "",
    name: "name",
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

  function onAddContactNumber(newValues: string[]) {
    setValue("contactNumbers", newValues);
  }

  function onRemoveContactNumber(newValues: string[]) {
    setValue("contactNumbers", newValues);
  }

  function preloadFields(fields: TCustomer) {
    reset(fields);
  }

  const setCustomer: SubmitHandler<TCustomerFormSchemaType> = (data) => {
    setIsSubmitting(true);
    if (route.params?.isUpdate) {
      updateCustomer(
        route.params?.customerDetails?.id || "",
        data,
        () => {
          showToast({
            title: "Success",
            message: "Contact information has been updated",
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
      return;
    }

    addCustomer(
      data,
      () => {
        showToast({
          title: "Success",
          message: "Contact has been added",
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
  };

  return {
    name,
    contactNumbers,
    address,
    errors,
    isSubmitting,
    CTAText,
    handleSubmit,
    onAddContactNumber,
    onRemoveContactNumber,
    preloadFields,
    setCustomer,
  };
}
