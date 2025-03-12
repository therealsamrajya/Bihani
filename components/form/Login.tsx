import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { loginUser } from "../../firebaseconfig";
import { Ionicons } from "@expo/vector-icons";
import HealthDashboard from "../dashboard/HealthDashboard";

interface FormProps {
  onNavigatetoRegister: () => void;
}

const Login = ({ onNavigatetoRegister }: FormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      setSuccessMessage("");
      return;
    }

    try {
      await loginUser(email, password);
      setSuccessMessage(`Login successful`);
      setErrorMessage("");

      // Show dashboard after short delay
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 1000);
    } catch (error: any) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  // If logged in, show the dashboard
  if (isLoggedIn) {
    return <HealthDashboard />;
  }

  return (
    <View className="flex items-center" style={styles.container}>
      <Text style={styles.headerText}>Welcome Back</Text>
      <Text style={styles.subHeaderText}>Sign in to continue</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#777"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.forgotPasswordContainer}>
          <Pressable>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={onNavigatetoRegister}>
            <Text style={styles.registerText}>Register Here</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "PoppinsBold",
    color: "#333",
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "PoppinsRegular",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 14,
    width: "100%",
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "PoppinsRegular",
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 46,
    paddingVertical: 6,
    color: "#333",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#555",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  successMessage: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    color: "#5CB85C",
  },
  errorMessage: {
    marginTop: 12,
    color: "#f44336",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  footerContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
  footerText: {
    color: "#555",
    fontSize: 14,
  },
  registerText: {
    color: "#4285F4",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
});

export default Login;
