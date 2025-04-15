// useAuthStateListener.ts
import { useEffect } from "react";
import { subscribeToAuthChanges, auth } from "../firebaseconfig";
import useUserStore from "../store/useuserStore";
import { loadUserDataFromFirestore } from "../services/userService";
import { router } from "expo-router";
import { signOut } from "firebase/auth";

export const useAuthStateListener = () => {
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      const { clearUser } = useUserStore.getState();

      if (user) {
        // User is signed in
        try {
          // Load user data from Firestore
          await loadUserDataFromFirestore(user.uid);
        } catch (error) {
          console.error("Error loading user data:", error);
          // Clear the store on error
          clearUser();
        }
      } else {
        // User is signed out
        clearUser();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
};

// Helper function to handle logout
export const handleLogout = async () => {
  try {
    console.log("Starting logout");

    // Navigate to index first
    router.replace("/");

    // Add a small delay to let navigation happen
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Then signout of Firebase
    await signOut(auth);
    console.log("Firebase signed out");

    // Finally clear the store
    useUserStore.getState().clearUser();
    console.log("Store cleared");

    console.log("Successfully logged out and navigated to index");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
