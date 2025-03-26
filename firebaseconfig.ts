// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5JScRvA2OOBeCIh5atFpzaTJBK2zP4ak",
  authDomain: "bihani-fc1dd.firebaseapp.com",
  projectId: "bihani-fc1dd",
  storageBucket: "bihani-fc1dd.firebasestorage.app",
  messagingSenderId: "613789466480",
  appId: "1:613789466480:web:89d44fbf473bc9610159b5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const saveUserData = async (
  userId: string,
  userData: {
    name?: string;
    email: string;
    stepsGoal?: number;
    waterGoal?: number;
    stepsTaken?: number;
    waterTaken?: number;
    createdAt?: Date;
  }
) => {
  try {
    const dataToSave = {
      ...userData,
      stepsTaken: userData.stepsTaken || 0,
      waterTaken: userData.waterTaken || 0,
      createdAt: userData.createdAt || new Date(),
    };

    await setDoc(doc(db, "users", userId), dataToSave);
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Initialize the WebBrowser for Auth
WebBrowser.maybeCompleteAuthSession();

// Create a Google provider instance
const googleProvider = new GoogleAuthProvider();

// Function to handle user sign-up
export const signUpUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
    // Throw error so components can catch it
    throw error;
  }
};

// Function to handle user login
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
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
    } catch (error: any) {
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
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// Export Firebase objects
export { app, auth, db };
