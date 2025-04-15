// Import the necessary Firebase modules
import { initializeApp, FirebaseApp, getApps } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR4Em0Ce9UOpEi9XLFFLTYqIdMYKPQ0II",
  authDomain: "bihani-a733d.firebaseapp.com",
  projectId: "bihani-a733d",
  storageBucket: "bihani-a733d.firebasestorage.app",
  messagingSenderId: "287332360237",
  appId: "1:287332360237:web:7689e7022559c35e5158a4",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Check if Firebase app is already initialized
const apps = getApps();
if (apps.length === 0) {
  // If no Firebase app exists, initialize a new one
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // If Firebase app already exists, use that one
  app = apps[0];
  auth = getAuth(app);
}

// Initialize Firestore
db = getFirestore(app);

// Initialize the WebBrowser for Auth
WebBrowser.maybeCompleteAuthSession();

// Create a Google provider instance
const googleProvider = new GoogleAuthProvider();

// Function to handle user sign-up
export const signUpUser = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  } catch (error) {
    // Throw error so components can catch it
    throw error;
  }
};

// Function to handle user login
export const loginUser = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  } catch (error) {
    // Throw error so components can catch it
    throw error;
  }
};

// Custom hook to handle Google Sign-in for Expo projects
export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "869194027350-ksrsict1g56956ee7a5eadj5t2ddjdlp.apps.googleusercontent.com",
    androidClientId:
      "869194027350-799bn525jnjti04uvq86u668lqvtda7d.apps.googleusercontent.com",
    redirectUri: "com.samrajya_chand.Bihani:/oauthredirect",
    scopes: ["profile", "email"], // Request these specific scopes for proper authentication
  });

  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      if (response?.type === "success") {
        // Create a Google credential with the token
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);

        // Sign in with credential from the Google user
        const userCredential = await signInWithCredential(auth, credential);
        return userCredential;
      }

      return null;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  return { request, response, promptAsync, signInWithGoogle };
};

// Function to handle user logout
export const logoutUser = async (): Promise<void> => {
  return signOut(auth);
};

// Function to get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Function to subscribe to auth state changes
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Export Firebase objects
export { app, auth, db };
