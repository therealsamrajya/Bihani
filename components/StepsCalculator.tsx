import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import * as Device from "expo-device";
import CircleDisplay from "./ui/CircleDisplay";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const StepsCalculator = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [stepHistory, setStepHistory] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [milestone, setMilestone] = useState<string>("Just started");

  const screenWidth = Dimensions.get("window").width - 40;

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

            // Update step history every time steps change
            setStepHistory((prevHistory) => {
              const newHistory = [...prevHistory.slice(1), result.steps];
              return newHistory;
            });
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

  // Update milestone based on step count
  useEffect(() => {
    if (currentStepCount >= 10000) {
      setMilestone("Daily goal reached! 🎉");
    } else if (currentStepCount >= 7500) {
      setMilestone("Almost there! 🏃‍♂️");
    } else if (currentStepCount >= 5000) {
      setMilestone("Halfway to goal! 👍");
    } else if (currentStepCount >= 2500) {
      setMilestone("Good progress! 👏");
    } else if (currentStepCount >= 1000) {
      setMilestone("Great start! 🚶‍♀️");
    } else if (currentStepCount > 0) {
      setMilestone("First steps taken! 🌱");
    }
  }, [currentStepCount]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  goalContainer: {
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  goalText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
  },
  milestoneContainer: {
    backgroundColor: "#EBF5FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 12,
  },
  milestoneText: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    elevation: 1,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#666",
  },
  deviceCompatibility: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
    alignSelf: "flex-start",
  },
  chartContainer: {
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    padding: 8,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
  },
});

export default StepsCalculator;
