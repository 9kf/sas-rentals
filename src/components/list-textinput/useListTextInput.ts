import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import z from "zod/lib";

const listTextInputSchema = z.object({
  newValue: z.string().min(1, { message: "Field is requried" }),
});

export type ListTextInputSchemaType = z.infer<typeof listTextInputSchema>;

interface IUseListTextInputProps {
  onAdd?: (values: string[]) => void;
  onRemove?: (values: string[]) => void;
}

export function useListTextInput(props?: IUseListTextInputProps) {
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<ListTextInputSchemaType>({
    resolver: zodResolver(listTextInputSchema),
  });

  const { field: newValue } = useController({
    control,
    defaultValue: "",
    name: "newValue",
  });

  const [values, setValues] = useState<string[]>([]);

  const addValue: SubmitHandler<ListTextInputSchemaType> = (data) => {
    const newValues = [...values, data.newValue];
    setValues(newValues);
    props?.onAdd?.(newValues);
    setValue("newValue", "");
    trigger("newValue");
  };

  function removeValue(index: number) {
    const newValues = values.filter((val, i) => i !== index);
    props?.onRemove?.(newValues);
    setValues(newValues);
  }

  function overrideValues(newValues: string[]) {
    setValues(newValues);
  }

  return {
    states: {
      values,
      newValue,
      isValid,
      errors,
    },
    functions: {
      handleSubmit,
      addValue,
      removeValue,
      overrideValues,
    },
  };
}
