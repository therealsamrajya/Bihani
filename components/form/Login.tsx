import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { loginUser, useGoogleSignIn } from "../../firebaseconfig";
import { Ionicons } from "@expo/vector-icons";
import HealthDashboard from "../dashboard/HealthDashboard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import useUserStore from "@/store/useuserStore";
import { saveUserData } from "@/services/userService";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { setUser } = useUserStore();

  // Initialize Google Sign-In hook
  const { promptAsync, signInWithGoogle, response } = useGoogleSignIn();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle standard email/password login
  const handleLogin = async () => {
    // Reset messages
    setErrorMessage("");
    setSuccessMessage("");

    // Form validation
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      setSuccessMessage("Login successful");

      //check if user exists if not create it
      const user = userCredential.user;
      setUser({
        userId: user.uid,
        email: user.email || email,
        name: user.displayName || "",
      });
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // User doesn't have data in Firestore yet, create it
          await saveUserData(user.uid, {
            email: user.email || email,
            name: user.displayName || "",
            stepsGoal: 8000,
            waterGoal: 10,
          });
        }
      } catch (err) {
        console.error("Error checking user data:", err);
        // Continue with login even if this fails
      }

      // Show dashboard after short delay
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 1000);
    } catch (error: any) {
      // Format Firebase error messages to be more user-friendly
      let message = error.message || "Login failed. Please try again.";

      if (message.includes("auth/invalid-email")) {
        message = "Invalid email format";
      } else if (message.includes("auth/user-not-found")) {
        message = "No account exists with this email";
      } else if (message.includes("auth/wrong-password")) {
        message = "Incorrect password";
      } else if (message.includes("auth/too-many-requests")) {
        message = "Too many failed attempts. Please try again later";
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await promptAsync();
      // The response will be processed in useEffect
    } catch (error: any) {
      setErrorMessage("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // Process Google Sign-In response
  useEffect(() => {
    const processGoogleSignIn = async () => {
      if (response?.type === "success") {
        try {
          const userCredential = await signInWithGoogle();
          if (userCredential) {
            setSuccessMessage("Google login successful");

            // Show dashboard after short delay
            setTimeout(() => {
              setIsLoggedIn(true);
            }, 1000);
          }
        } catch (error: any) {
          console.error("Google sign-in processing error:", error);
          setErrorMessage(
            "Failed to authenticate with Google. Please try again.",
          );
        } finally {
          setIsGoogleLoading(false);
        }
      } else if (response?.type === "error") {
        setErrorMessage("Google sign-in was canceled or failed");
        setIsGoogleLoading(false);
      }
    };

    if (response) {
      processGoogleSignIn();
    }
  }, [response]);

  // If logged in, show the dashboard
  if (isLoggedIn) {
    return <HealthDashboard />;
  }

  return (
    <View style={styles.container}>
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
              autoComplete="email"
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
              autoComplete="password"
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

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.googleButton,
            isGoogleLoading && styles.disabledButton,
          ]}
          onPress={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons
                name="logo-google"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </>
          )}
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
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#9CBAE5",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  separatorText: {
    paddingHorizontal: 10,
    color: "#666",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 10,
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
