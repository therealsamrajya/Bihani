import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import CircleDisplay from "../ui/CircleDisplay";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

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

export default WaterCounter;
