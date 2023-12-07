// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  Auth,
  connectAuthEmulator,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: Constants.expoConfig!.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig!.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig!.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig!.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig!.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig!.extra?.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth
let auth: Auth;
if (__DEV__) {
  // Configure Firebase Auth for Emulator Suite
  auth = getAuth(app);
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
} else {
  // For production or non-development environments
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
export { auth };
