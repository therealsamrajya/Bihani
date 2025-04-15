// components/LogoutComponent.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../../firebaseconfig";
import { signOut } from "firebase/auth";
import useUserStore from "../../store/useuserStore";
import { router } from "expo-router";

const Logout = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            setIsLoading(true);
            try {
              // First, clear the user store to prevent any data fetching during transition
              clearUser();
              console.log("User store cleared");

              // Then sign out from Firebase
              if (auth.currentUser) {
                await signOut(auth);
                console.log("Firebase sign out successful");
              } else {
                console.log("No user found to sign out");
              }

              // Wait a moment to ensure all cleanup happens before navigation
              setTimeout(() => {
                // Navigate using Expo Router with navigation reset
                router.replace({
                  pathname: "/(tabs)/profile",
                  // This will help ensure any previous navigation state is cleared
                  params: { reset: Date.now() },
                });
                setIsLoading(false);
              }, 300);
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert(
                "Error",
                `Failed to logout completely: ${(error as Error).message}`,
              );

              // Even if Firebase sign out fails, ensure user store is cleared
              clearUser();

              setTimeout(() => {
                router.replace("/(tabs)/profile");
                setIsLoading(false);
              }, 300);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <FontAwesome name="sign-out" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
  },
  logoutText: {
    color: "#fff",
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
});

export default Logout;
