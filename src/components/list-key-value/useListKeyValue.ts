import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import z from "zod/lib";

const listKeyValueSchema = z.object({
  name: z.string().min(1, { message: "Field is requried" }),
  value: z.string().min(1, { message: "Field is requried" }),
});

export type ListKeyValueSchemaType = z.infer<typeof listKeyValueSchema>;

export function useListKeyValue() {
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
    setValues([...values, data]);
    setValue("name", "");
    setValue("value", "");
    trigger();
  };

  function removeValue(index: number) {
    setValues(values.filter((val, i) => i !== index));
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
    },
  };
}
