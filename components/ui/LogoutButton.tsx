// components/LogoutButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { handleLogout } from "../../utils/useAuthStateListener";
import { useAuth } from "@/context/AuthContext";

type LogoutButtonProps = {
  buttonStyle?: object;
  textStyle?: object;
};

const LogoutButton = ({ buttonStyle, textStyle }: LogoutButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handleLogout}
    >
      <Text style={[styles.buttonText, textStyle]}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LogoutButton;
