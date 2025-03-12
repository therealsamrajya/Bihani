import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import CircleDisplay from "./ui/CircleDisplay";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WaterCounter = () => {
  const [waterCount, setWaterCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8); // Default daily goal: 8 glasses
  const [waterHistory, setWaterHistory] = useState<number[]>([
    3, 4, 5, 6, 4, 0,
  ]);
  const [milestone, setMilestone] = useState<string>("Start hydrating");

  const screenWidth = Dimensions.get("window").width - 40;

  const incrementWater = () => {
    setWaterCount(waterCount + 1);
    // Update the current day's data in the history
    setWaterHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = waterCount + 1;
      return newHistory;
    });
  };

  const decrementWater = () => {
    if (waterCount > 0) {
      setWaterCount(waterCount - 1);
      // Update the current day's data in the history
      setWaterHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = waterCount - 1;
        return newHistory;
      });
    }
  };

  // Update milestone based on water intake
  useEffect(() => {
    const percentage = (waterCount / dailyGoal) * 100;

    if (percentage >= 100) {
      setMilestone("Goal reached! 🎉");
    } else if (percentage >= 75) {
      setMilestone("Almost there! 💧");
    } else if (percentage >= 50) {
      setMilestone("Halfway there! 💦");
    } else if (percentage >= 25) {
      setMilestone("Good start! 💧");
    } else if (waterCount > 0) {
      setMilestone("First glass! 💧");
    } else {
      setMilestone("Start hydrating");
    }
  }, [waterCount, dailyGoal]);

  // Calculate percentage towards goal
  const goalPercentage = Math.min(
    Math.round((waterCount / dailyGoal) * 100),
    100,
  );

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Today"],
    datasets: [
      {
        data: waterHistory,
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
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
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake</Text>

      <CircleDisplay
        value={waterCount}
        unit="Glasses"
        size={120}
        backgroundColor="#4A90E2"
        valueColor="white"
        unitColor="white"
      />

      <View style={styles.goalContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${goalPercentage}%` }]} />
        </View>
        <Text style={styles.goalText}>
          {goalPercentage}% of daily goal ({waterCount}/{dailyGoal} glasses)
        </Text>
      </View>

      <View style={styles.milestoneContainer}>
        <Text style={styles.milestoneText}>{milestone}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.decrementButton]}
          onPress={decrementWater}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.incrementButton]}
          onPress={incrementWater}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.graphTitle}>Weekly History</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth}
          height={180}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars={true}
          fromZero={true}
          yAxisSuffix=""
          yAxisLabel=""
        />
      </View>

      <View style={styles.tipsContainer}>
        <View style={styles.tipHeader}>
          <Ionicons name="water" size={18} color="#4A90E2" />
          <Text style={styles.tipTitle}>Hydration Tip</Text>
        </View>
        <Text style={styles.tipText}>
          Try to drink a glass of water with each meal and between meals to
          reach your daily goal.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: "#4A90E2",
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
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  decrementButton: {
    backgroundColor: "#FF6B6B",
  },
  incrementButton: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
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
  tipsContainer: {
    width: "100%",
    backgroundColor: "#E6F2FF",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default WaterCounter;
