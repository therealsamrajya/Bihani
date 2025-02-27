import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import * as Device from "expo-device";

const StepsCalculator = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const subscribe = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Check if pedometer is available
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);

        if (isAvailable) {
          // Set the current time as our starting point
          const now = new Date();
          setStartTime(now.toLocaleTimeString());

          // Start watching step count
          const pedometerSubscription = Pedometer.watchStepCount((result) => {
            setCurrentStepCount(result.steps);
          });

          setSubscription(pedometerSubscription);
        } else {
          setError("Pedometer is not available on this device");
        }
      } catch (error) {
        console.error("Error subscribing to Pedometer:", error);
        setError("Failed to access pedometer. Please check permissions.");
      } finally {
        setIsLoading(false);
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Format steps with thousands separator
  const formattedSteps = currentStepCount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading step counter...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.stepsCircle}>
            <Text style={styles.stepsNumber}>{formattedSteps}</Text>
            <Text style={styles.stepsLabel}>steps</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Tracking since: {startTime}</Text>
            <Text style={styles.infoText}>
              Device: {Device.modelName || "Unknown device"}
            </Text>
            <Text style={styles.deviceCompatibility}>
              {isPedometerAvailable
                ? "✓ Step counter available"
                : "✗ Step counter not available"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#ffeeee",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  errorText: {
    color: "#cc0000",
    fontSize: 16,
    textAlign: "center",
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  stepsCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 4,
  },
  stepsNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  stepsLabel: {
    fontSize: 18,
    color: "white",
    opacity: 0.8,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  deviceCompatibility: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

export default StepsCalculator;
