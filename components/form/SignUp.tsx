import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { signUpUser } from "../../firebaseconfig";
import { Ionicons } from "@expo/vector-icons";

interface FormProps {
  onNavigatetoLogin: () => void;
}

const SignUp = ({ onNavigatetoLogin }: FormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      setSuccessMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setSuccessMessage("");
      return;
    }

    try {
      await signUpUser(email, password);
      setSuccessMessage(`Account created successfully!`);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <View className="flex items-center" style={styles.container}>
      <Text style={styles.headerText}>Create Account</Text>
      <Text style={styles.subHeaderText}>Sign up to get started</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Enter your full name"
            />
          </View>
        </View>

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
              placeholder="Create a password"
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm your password"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#777"
              />
            </Pressable>
          </View>
        </View>

        <Text style={styles.termsText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={onNavigatetoLogin}>
            <Text style={styles.loginText}>Login Here</Text>
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
  },
  headerText: {
    fontSize: 24,
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
    fontFamily: "PoppinsRegular",
    fontWeight: "500",
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
  termsText: {
    fontSize: 11,
    color: "#FF9800",
    textAlign: "center",
    marginBottom: 16,
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
  loginText: {
    color: "#4285F4",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
});

export default SignUp;
