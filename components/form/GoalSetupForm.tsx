// Create a new file: GoalsSetupForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getCurrentUser } from "../../firebaseconfig";
import useUserStore from "@/store/useuserStore";
import { saveUserData } from "@/services/userService";

interface GoalsSetupProps {
  email: string;
  name: string;
  onComplete: () => void;
}

const GoalsSetupForm = ({ onComplete }: GoalsSetupProps) => {
  const [stepsGoal, setStepsGoal] = useState("8000");
  const [waterGoal, setWaterGoal] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userId, email, name, setUser, updateGoals } = useUserStore();

  const handleSaveGoals = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Save user data with goals to Firestore
      await saveUserData(userId!, {
        name: name ?? "",
        email: email ?? "",
        stepsGoal: parseInt(stepsGoal),
        waterGoal: parseInt(waterGoal),
      });

      setUser({
        userId: userId!,
        email: email!,
        name: name!,
      });

      updateGoals({
        stepsGoal: parseInt(stepsGoal),
        waterGoal: parseInt(waterGoal),
      });

      // Complete the registration process
      onComplete();
    } catch (error: any) {
      setErrorMessage(
        error.message || "Failed to save goals. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Set Your Health Goals</Text>
      <Text style={styles.subHeaderText}>
        Welcome {name}! Let's set up your daily health targets.
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Step Goal</Text>
          <TextInput
            style={styles.input}
            value={stepsGoal}
            onChangeText={setStepsGoal}
            placeholder="8000"
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>Recommended: 8,000 - 10,000 steps</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Water Goal (glasses)</Text>
          <TextInput
            style={styles.input}
            value={waterGoal}
            onChangeText={setWaterGoal}
            placeholder="10"
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>Recommended: 8-12 glasses</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSaveGoals}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Save Goals & Continue</Text>
          )}
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "PoppinsBold",
    color: "#333",
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "PoppinsRegular",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "PoppinsRegular",
    color: "#333",
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  hint: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#9CBAE5",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  errorMessage: {
    marginTop: 12,
    color: "#f44336",
    textAlign: "center",
  },
});

export default GoalsSetupForm;
