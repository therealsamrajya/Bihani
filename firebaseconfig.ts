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
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfZOyTYaujo5iKDjbFKS0C4-jbzdAI4P4",
  authDomain: "bihani-4c468.firebaseapp.com",
  projectId: "bihani-4c468",
  storageBucket: "bihani-4c468.firebasestorage.app",
  messagingSenderId: "29391720141",
  appId: "1:29391720141:web:eb2a4775d4aa5edf4ea384",
  measurementId: "G-65C9QEXXWT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
  } catch (error: any) {
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
  } catch (error: any) {
    // Throw error so components can catch it
    throw error;
  }
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
) => {
  return onAuthStateChanged(auth, callback);
};

// Export Firebase objects
export { app, auth };
