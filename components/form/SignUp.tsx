import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { signUpUser, useGoogleSignIn } from "../../firebaseconfig";
import { Ionicons } from "@expo/vector-icons";
import GoalsSetupForm from "./GoalSetupForm";
import useUserStore from "@/store/useuserStore";
import { saveUserData } from "../../services/userService";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoalsSetup, setShowGoalsSetup] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredName, setRegisteredName] = useState("");

  const { setUser } = useUserStore();

  // Initialize Google Sign-In hook
  const { promptAsync, signInWithGoogle, response } = useGoogleSignIn();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const isPasswordStrong = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handle standard email/password signup
  const handleSignUp = async () => {
    // Reset messages
    setErrorMessage("");
    setSuccessMessage("");

    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!isPasswordStrong(password)) {
      setErrorMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, and numbers",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signUpUser(email, password);
      const user = userCredential.user;

      await saveUserData(user.uid, {
        name: name, // Use the name from the form explicitly
        email: email,
        // other optional fields
      });

      setUser({
        userId: user.uid,
        email: user.email || email,
        name: name, // Use the name from the form
      });
      // setUser({
      //   userId: user.uid,
      //   email: user.email || email,
      //   name: user.displayName || "",
      // });
      setSuccessMessage("Account created successfully!");

      //save basic user data and show goals setup
      setRegisteredEmail(email);
      setRegisteredName(name);
      setShowGoalsSetup(true);
      setSuccessMessage(
        "Account created successfully! Now let's set up your goals.",
      );
      // Clear form fields
      setPassword("");
      setConfirmPassword("");

      // Optional: Auto-navigate to login after successful signup
      // setTimeout(() => {
      //   onNavigatetoLogin();
      // }, 2000);
    } catch (error: any) {
      // Format Firebase error messages to be more user-friendly
      let message = error.message || "Sign up failed. Please try again.";

      if (message.includes("auth/email-already-in-use")) {
        message = "This email address is already in use";
      } else if (message.includes("auth/invalid-email")) {
        message = "Invalid email format";
      } else if (message.includes("auth/weak-password")) {
        message = "Password is too weak";
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-Up
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await promptAsync();
      // The response will be processed in useEffect
    } catch (error: any) {
      setErrorMessage("Google sign-up failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // Process Google Sign-In response
  useEffect(() => {
    const processGoogleSignUp = async () => {
      if (response?.type === "success") {
        try {
          const userCredential = await signInWithGoogle();
          if (userCredential && userCredential.user) {
            const googleUser = userCredential.user;
            setRegisteredEmail(googleUser.email || "");
            setRegisteredName(googleUser.displayName || "");
            setShowGoalsSetup(true);
            setSuccessMessage(
              "Account created with Google successfully! Now let's set up your goals.",
            );

            // Optional: Auto-navigate to login after successful signup
            // setTimeout(() => {
            //   onNavigatetoLogin();
            // }, 2000);
          }
        } catch (error: any) {
          console.error("Google sign-up processing error:", error);
          let message = "Failed to create account with Google";

          if (
            error.message &&
            error.message.includes(
              "auth/account-exists-with-different-credential",
            )
          ) {
            message = "An account already exists with this email address";
          }

          setErrorMessage(message);
        } finally {
          setIsGoogleLoading(false);
        }
      } else if (response?.type === "error") {
        setErrorMessage("Google sign-up was canceled or failed");
        setIsGoogleLoading(false);
      }
    };

    if (response) {
      processGoogleSignUp();
    }
  }, [response]);

  const handleGoalsComplete = () => {
    // Navigate to login
    setTimeout(() => {
      onNavigatetoLogin();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {showGoalsSetup ? (
        <GoalsSetupForm
          email={registeredEmail}
          name={registeredName}
          onComplete={handleGoalsComplete}
        />
      ) : (
        <>
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
                  autoComplete="name"
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
                  placeholder="Create a password"
                  autoComplete="new-password"
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
              <Text style={styles.passwordHint}>
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </Text>
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
                  autoComplete="new-password"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#777"
                  />
                </Pressable>
              </View>
            </View>

            <Text style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </Text>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
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
              onPress={handleGoogleSignUp}
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
                  <Text style={styles.buttonText}>Sign up with Google</Text>
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
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={onNavigatetoLogin}>
                <Text style={styles.loginText}>Login Here</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
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
  passwordHint: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
    marginLeft: 2,
  },
  termsText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
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
  loginText: {
    color: "#4285F4",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
});

export default SignUp;
