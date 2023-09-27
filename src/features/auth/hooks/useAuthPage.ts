import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "../service";
import { useToast } from "../../../components";

const loginFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    isRegister: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.isRegister) {
      if (val.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 8,
          type: "string",
          message: "Password needs to be a minimum of 8 characters.",
          path: ["password"],
          inclusive: true,
          fatal: true,
        });

        return z.NEVER;
      }

      if (val.password !== val.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match.",
          path: ["confirmPassword"],
          fatal: true,
        });

        return z.NEVER;
      }
    }

    if (val.email.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        message: "Field required.",
        path: ["email"],
        inclusive: true,
        fatal: true,
      });

      return z.NEVER;
    }

    if (val.password.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        message: "Field required.",
        path: ["password"],
        inclusive: true,
        fatal: true,
      });

      return z.NEVER;
    }
  });

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export function useAuthPage() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
  });
  const { registerWithEmailAndPassword, signinWithEmailAndPassword } =
    useAuth();
  const showToast = useToast((state) => state.showToast);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { field: email } = useController({
    control,
    defaultValue: "",
    name: "email",
  });

  const { field: password } = useController({
    control,
    defaultValue: "",
    name: "password",
  });

  const { field: confirmPassword } = useController({
    control,
    defaultValue: "",
    name: "confirmPassword",
  });

  const { field: isRegister } = useController({
    control,
    defaultValue: false,
    name: "isRegister",
  });

  const login: SubmitHandler<LoginFormSchemaType> = async (data) => {
    setIsSubmitting(true);
    const response = await signinWithEmailAndPassword(
      data.email,
      data.password
    );
    setIsSubmitting(false);
    if (response !== "success") {
      authErrors(response);
      return;
    }
  };

  const signup: SubmitHandler<LoginFormSchemaType> = async (data) => {
    setIsSubmitting(true);
    const response = await registerWithEmailAndPassword(
      data.email,
      data.password
    );
    setIsSubmitting(false);
    if (response !== "success") {
      authErrors(response);
      return;
    }
  };

  const toggleForms = () => {
    const newRegisterValue = !getValues().isRegister;
    reset();
    setValue("isRegister", newRegisterValue);
  };

  const authErrors = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        showToast({
          title: "Error",
          message: "Email already used.",
          type: "error",
        });
        break;
      case "auth/invalid-email":
        showToast({ title: "Error", message: "Invalid email.", type: "error" });
        break;
      default:
        showToast({
          title: "Error",
          message: "There was an unexpected error. Please try again.",
          type: "error",
        });
    }
  };

  return {
    states: {
      email,
      password,
      confirmPassword,
      isSubmitting,
      isRegister,
      errors,
    },
    functions: {
      login,
      signup,
      handleSubmit,
      toggleForms,
    },
  };
}
