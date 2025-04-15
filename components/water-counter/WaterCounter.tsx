import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import CircleDisplay from "../ui/CircleDisplay";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import useUserStore from "@/store/useuserStore";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebaseconfig";
import {
  loadUserDataFromFirestore,
  saveWaterIntakeToFirestore,
} from "@/services/userService";

const WaterCounter = () => {
  const [waterCount, setWaterCount] = useState(0);
  const [waterHistory, setWaterHistory] = useState<number[]>([
    3, 4, 5, 6, 4, 0,
  ]);
  const [milestone, setMilestone] = useState<string>("Start hydrating");

  const { waterGoal } = useUserStore();

  const screenWidth = Dimensions.get("window").width - 40;

  useEffect(() => {
    const fetchInitialWaterIntake = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Load user data including goals from Firestore
        await loadUserDataFromFirestore(user.uid);

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const savedWaterGlasses = userDoc.data()?.waterTaken || 0;

        setWaterCount(savedWaterGlasses);
        // Update the current day's data in the history
        setWaterHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = savedWaterGlasses;
          return newHistory;
        });
      } catch (error) {
        console.error("Error fetching water intake:", error);
      }
    };

    fetchInitialWaterIntake();
  }, []);

  const incrementWater = async () => {
    const newWaterCount = waterCount + 1;
    setWaterCount(newWaterCount);

    // Update the current day's data in the history
    setWaterHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = newWaterCount;
      return newHistory;
    });

    // Save to Firestore
    await saveWaterIntakeToFirestore(newWaterCount);
  };

  const decrementWater = async () => {
    if (waterCount > 0) {
      const newWaterCount = waterCount - 1;
      setWaterCount(newWaterCount);

      // Update the current day's data in the history
      setWaterHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = newWaterCount;
        return newHistory;
      });

      // Save to Firestore
      await saveWaterIntakeToFirestore(newWaterCount);
    }
  };

  // Update milestone based on water intake
  useEffect(() => {
    const percentage = (waterCount / waterGoal) * 100;

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
  }, [waterCount, waterGoal]);

  // Calculate percentage towards goal
  const goalPercentage = Math.min(
    Math.round((waterCount / waterGoal) * 100),
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

  useEffect(() => {
    console.log("Current waterGoal from store:", waterGoal);
  }, [waterGoal]);

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
          {goalPercentage}% of daily goal ({waterCount}/{waterGoal} glasses)
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
