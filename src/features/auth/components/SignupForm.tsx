import {
  GestureResponderEvent,
  Pressable,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Spinner } from "@ui-kitten/components/ui";
import { ControllerRenderProps, FieldErrors } from "react-hook-form";

import useTheme from "../../../theme/useTheme";
import { LoginFormSchemaType } from "../hooks";

interface ISignupFormProps {
  email: ControllerRenderProps<LoginFormSchemaType, "email">;
  password: ControllerRenderProps<LoginFormSchemaType, "password">;
  confirmPassword: ControllerRenderProps<
    LoginFormSchemaType,
    "confirmPassword"
  >;
  errors: FieldErrors<LoginFormSchemaType>;
  isSubmitting: boolean;
  onRegisterClicked: ((event: GestureResponderEvent) => void) | undefined;
  onClickBackToLogin: () => void;
}

export function SignupForm({
  email,
  password,
  confirmPassword,
  errors,
  isSubmitting,
  onRegisterClicked,
  onClickBackToLogin,
}: ISignupFormProps) {
  const { containerStyles, textStyles, inputStyles, buttonStyles } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <View style={{ gap: 12, paddingHorizontal: 16, marginBottom: 16 }}>
        <View>
          <Text style={textStyles.fieldLabel}>Email </Text>
          <View>
            <TextInput
              style={inputStyles.textInput}
              value={email.value}
              onChangeText={email.onChange}
            />
          </View>
          {errors.email && (
            <Text style={textStyles.fieldError}>{errors.email.message}</Text>
          )}
        </View>

        <View>
          <Text style={textStyles.fieldLabel}>Password </Text>
          <View>
            <TextInput
              style={inputStyles.textInput}
              value={password.value}
              onChangeText={password.onChange}
              secureTextEntry
            />
          </View>
          {errors.password && (
            <Text style={textStyles.fieldError}>{errors.password.message}</Text>
          )}
        </View>

        <View>
          <Text style={textStyles.fieldLabel}>Confirm Password </Text>
          <View>
            <TextInput
              style={inputStyles.textInput}
              value={confirmPassword.value}
              onChangeText={confirmPassword.onChange}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword && (
            <Text style={textStyles.fieldError}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>
      </View>

      <TouchableNativeFeedback
        onPress={onRegisterClicked}
        disabled={isSubmitting}
      >
        <View
          style={{
            ...containerStyles.centerAll,
            ...(isSubmitting ? buttonStyles.disabled : buttonStyles.cta),
            marginHorizontal: 16,
          }}
        >
          {isSubmitting ? (
            <Spinner style={{ borderColor: "white" }} />
          ) : (
            <Text style={{ ...textStyles.buttonText }}>Register</Text>
          )}
        </View>
      </TouchableNativeFeedback>

      <View
        style={{
          flexDirection: "row",
          gap: 4,
          alignSelf: "center",
          marginTop: 16,
        }}
      >
        <Text>Already have an account?</Text>
        <Pressable onPress={onClickBackToLogin}>
          <Text style={{ textDecorationLine: "underline", color: "#EC9110" }}>
            Back to login form.
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
