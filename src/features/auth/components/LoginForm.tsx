import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import AntDesignIcons from "@expo/vector-icons/AntDesign";
import { ControllerRenderProps, FieldErrors } from "react-hook-form";
import { Spinner } from "@ui-kitten/components/ui";

import useTheme from "../../../theme/useTheme";
import { useAuth } from "../service";
import { LoginFormSchemaType } from "../hooks";

interface ILoginFormProps {
  email: ControllerRenderProps<LoginFormSchemaType, "email">;
  password: ControllerRenderProps<LoginFormSchemaType, "password">;
  errors: FieldErrors<LoginFormSchemaType>;
  isSubmitting: boolean;
  onLoginClicked: ((event: GestureResponderEvent) => void) | undefined;
  onClickRegister: () => void;
}

export function LoginForm({
  email,
  password,
  errors,
  isSubmitting,
  onLoginClicked,
  onClickRegister,
}: ILoginFormProps) {
  const { containerStyles, textStyles, inputStyles, buttonStyles } = useTheme();
  const onGoogleButtonPress = useAuth((state) => state.onGoogleLinkButtonPress);

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
      </View>

      <TouchableNativeFeedback onPress={onLoginClicked} disabled={isSubmitting}>
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
            <Text style={{ ...textStyles.buttonText }}>Login</Text>
          )}
        </View>
      </TouchableNativeFeedback>

      <View
        style={{
          height: 1,
          backgroundColor: "gray",
          marginVertical: 16,
        }}
      />

      <View style={{ paddingHorizontal: 16 }}>
        <AntDesignIcons.Button
          name="google"
          onPress={onGoogleButtonPress}
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              ...textStyles.buttonText,
              textTransform: "none",
            }}
          >
            Sign in with Google
          </Text>
        </AntDesignIcons.Button>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 4,
          alignSelf: "center",
          marginTop: 16,
        }}
      >
        <Text>Don't have an account?</Text>
        <Pressable onPress={onClickRegister}>
          <Text style={{ textDecorationLine: "underline", color: "#EC9110" }}>
            Register here.
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
