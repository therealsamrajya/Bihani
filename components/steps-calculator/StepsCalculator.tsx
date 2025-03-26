import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import * as Device from "expo-device";
import CircleDisplay from "../ui/CircleDisplay";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { styles } from "./styles";
import useUserStore from "@/store/useuserStore";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebaseconfig";

const StepsCalculator = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [stepHistory, setStepHistory] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [milestone, setMilestone] = useState<string>("Just started");
  const [lastSavedSteps, setLastSavedSteps] = useState(0);

  const { stepsGoal } = useUserStore();

  const screenWidth = Dimensions.get("window").width - 40;

  const saveStepsToFirestore = async (steps: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        stepsTaken: steps,
        lastStepUpdateTimestamp: new Date(),
      });

      setLastSavedSteps(steps);
    } catch (error) {
      console.error("Error saving steps:", error);
    }
  };

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

          const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            const savedSteps = userDoc.data()?.stepsTaken || 0;
            setCurrentStepCount(savedSteps);
            setLastSavedSteps(savedSteps);
          }

          // Start watching step count
          const pedometerSubscription = Pedometer.watchStepCount(
            async (result) => {
              const newStepCount = result.steps;
              setCurrentStepCount(newStepCount);

              // Update step history
              setStepHistory((prevHistory) => {
                const newHistory = [...prevHistory.slice(1), newStepCount];
                return newHistory;
              });
              // Save steps to Firestore if significant change (e.g., 100 steps) or after a period of inactivity

              if (Math.abs(newStepCount - lastSavedSteps) >= 100) {
                await saveStepsToFirestore(newStepCount);
              }
            },
          );

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

  useEffect(() => {
    const percentage = (currentStepCount / stepsGoal) * 100;

    if (percentage >= 100) {
      setMilestone("Daily goal reached! 🎉");
    } else if (percentage >= 75) {
      setMilestone("Almost there! 🏃‍♂️");
    } else if (percentage >= 50) {
      setMilestone("Halfway to goal! 👍");
    } else if (percentage >= 25) {
      setMilestone("Good progress! 👏");
    } else if (currentStepCount >= 1000) {
      setMilestone("Great start! 🚶‍♀️");
    } else if (currentStepCount > 0) {
      setMilestone("First steps taken! 🌱");
    }
  }, [currentStepCount, stepsGoal]);

  // Format steps with thousands separator
  const formattedSteps = currentStepCount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Calculate percentage towards goal (10,000 steps)
  const goalPercentage = Math.min(
    Math.round((currentStepCount / 10000) * 100),
    100,
  );

  const chartData = {
    labels: ["", "", "", "", "", "Now"],
    datasets: [
      {
        data: stepHistory,
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#4A90E2",
    },
  };

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
          <Text style={styles.title}>Daily Steps</Text>

          <CircleDisplay
            value={formattedSteps}
            unit="steps"
            size={120}
            backgroundColor="#4A90E2"
          />

          <View style={styles.goalContainer}>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${goalPercentage}%` }]}
              />
            </View>
            <Text style={styles.goalText}>{goalPercentage}% of daily goal</Text>
          </View>

          <View style={styles.milestoneContainer}>
            <Text style={styles.milestoneText}>{milestone}</Text>
          </View>

          <Text style={styles.graphTitle}>Step History</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
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

export default StepsCalculator;
