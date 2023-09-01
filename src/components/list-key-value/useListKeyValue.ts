import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import z from "zod/lib";

const listKeyValueSchema = z.object({
  name: z.string().min(1, { message: "Field is requried" }),
  value: z.string().min(1, { message: "Field is requried" }),
});

export type ListKeyValueSchemaType = z.infer<typeof listKeyValueSchema>;

interface IUseListKeyValueProps {
  onAdd?: (values: ListKeyValueSchemaType[]) => void;
  onRemove?: (values: ListKeyValueSchemaType[]) => void;
}

export function useListKeyValue(props?: IUseListKeyValueProps) {
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<ListKeyValueSchemaType>({
    resolver: zodResolver(listKeyValueSchema),
  });

  const { field: name } = useController({
    control,
    defaultValue: "",
    name: "name",
  });

  const { field: value } = useController({
    control,
    defaultValue: "",
    name: "value",
  });

  const [values, setValues] = useState<ListKeyValueSchemaType[]>([]);

  const addValue: SubmitHandler<ListKeyValueSchemaType> = (data) => {
    const newValues = [...values, data];
    props?.onAdd?.(newValues);
    setValues(newValues);
    setValue("name", "");
    setValue("value", "");
    trigger();
  };

  function removeValue(index: number) {
    const newValues = values.filter((val, i) => i !== index);
    props?.onAdd?.(newValues);
    setValues(newValues);
  }

  function overrideValues(newValues: ListKeyValueSchemaType[]) {
    setValues(newValues);
  }

  return {
    states: {
      values,
      name,
      value,
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
