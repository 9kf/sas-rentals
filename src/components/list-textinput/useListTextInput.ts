import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import z from "zod/lib";

const listTextInputSchema = z.object({
  newValue: z.string().min(1, { message: "Field is requried" }),
});

export type ListTextInputSchemaType = z.infer<typeof listTextInputSchema>;

interface IUseListTextInputProps<T> {
  onAdd?: (values: T[]) => void;
}

export function useListTextInput() {
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
    setValues([...values, data.newValue]);
    setValue("newValue", "");
    trigger("newValue");
  };

  function removeValue(index: number) {
    setValues(values.filter((val, i) => i !== index));
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
    },
  };
}
