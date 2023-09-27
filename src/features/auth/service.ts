import { create } from "zustand";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface IAuthState {
  user: FirebaseAuthTypes.User | null;
  onAuthStateChanged: (user: FirebaseAuthTypes.User | null) => void;
  onGoogleLinkButtonPress: () => void;
  registerWithEmailAndPassword: (
    username: string,
    password: string
  ) => Promise<string>;
  signinWithEmailAndPassword: (
    username: string,
    password: string
  ) => Promise<string>;
}

export const useAuth = create<IAuthState>()((set, get) => {
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    set(() => ({ user }));
  }

  async function onGoogleLinkButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the user ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const signin = await auth().signInWithCredential(googleCredential);

    if (signin.additionalUserInfo?.isNewUser) {
      // Link the user with the credential
      const firebaseUserCredential =
        await auth().currentUser?.linkWithCredential(googleCredential);
    }
    // You can store in your app that the account was linked.
    return;
  }

  async function registerWithEmailAndPassword(
    username: string,
    password: string
  ) {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        username,
        password
      );

      return "success";
    } catch (error: any) {
      return error.code as string;
    }
  }

  async function signinWithEmailAndPassword(
    username: string,
    password: string
  ) {
    try {
      const response = await auth().signInWithEmailAndPassword(
        username,
        password
      );

      return "success";
    } catch (error: any) {
      return error.code as string;
    }
  }

  return {
    user: null,
    onAuthStateChanged,
    onGoogleLinkButtonPress,
    registerWithEmailAndPassword,
    signinWithEmailAndPassword,
  };
});
