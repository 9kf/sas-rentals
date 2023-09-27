import { Image, Dimensions, ScrollView } from "react-native";
import useTheme from "../../theme/useTheme";
import { LoginForm, SignupForm, useAuthPage } from "../../features/auth";

const LOGO = require("../../assets/imgs/bgless_icon.png");
const logoHeight = Dimensions.get("screen").height * 0.4;
const logoWidth = Dimensions.get("screen").width * 0.4;

export default function Auth() {
  const { containerStyles } = useTheme();
  const {
    states: {
      email,
      password,
      confirmPassword,
      isRegister,
      isSubmitting,
      errors,
    },
    functions: { handleSubmit, login, signup, toggleForms },
  } = useAuthPage();

  return (
    <ScrollView
      style={{
        ...containerStyles.defaultPageStyle,
      }}
    >
      <Image
        resizeMethod="scale"
        resizeMode="cover"
        source={LOGO}
        style={{
          height: logoHeight,
          width: logoWidth,
          alignSelf: "center",
        }}
      />
      {isRegister.value ? (
        <SignupForm
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          errors={errors}
          isSubmitting={isSubmitting}
          onClickBackToLogin={toggleForms}
          onRegisterClicked={handleSubmit(signup)}
        />
      ) : (
        <LoginForm
          email={email}
          password={password}
          errors={errors}
          isSubmitting={isSubmitting}
          onLoginClicked={handleSubmit(login)}
          onClickRegister={toggleForms}
        />
      )}
    </ScrollView>
  );
}
