import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { HealthMetric } from "@/types";
import useUserStore from "@/store/useuserStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseconfig";

const HealthDashboard = () => {
  // Get user data from the store
  const { userId, name, stepsGoal, waterGoal } = useUserStore();

  const [currentDate, setCurrentDate] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);

  // Mock step data for the chart
  const stepData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [5421, 6754, 8900, 7254, 9200, 8100, 7254],
        color: (opacity = 1) => `rgba(92, 184, 92, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  useEffect(() => {
    // Set current date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("en-US", options));

    // Fetch user data from Firestore
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    const userDocRef = doc(db, "users", userId);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);

          // Update metrics based on Firestore data
          setMetrics([
            {
              icon: "water-outline",
              title: "Water Intake",
              value: data.waterTaken || 0,
              unit: "glasses",
              color: "#4A90E2",
              target: data.waterGoal,
              percentage: data.waterTaken
                ? Math.min(100, (data.waterTaken / waterGoal) * 100)
                : 0,
            },
            {
              icon: "footsteps-outline",
              title: "Steps",
              value: data.stepsTaken || 0,
              unit: "steps",
              color: "#5CB85C",
              target: data.stepsGoal,
              percentage: data.stepsTaken
                ? Math.min(100, (data.stepsTaken / stepsGoal) * 100)
                : 0,
            },
            {
              icon: "flame-outline",
              title: "Calories Burned",
              value: data.caloriesBurned || 420,
              unit: "kcal",
              color: "#FF9800",
              target: 600,
              percentage: data.caloriesBurned
                ? Math.min(100, (data.caloriesBurned / 600) * 100)
                : 70,
            },
            {
              icon: "bed-outline",
              title: "Sleep",
              value: data.sleepDuration || "6h 45m",
              unit: "",
              color: "#8E44AD",
              target: "8h 00m",
              percentage: data.sleepDuration ? 84 : 84,
            },
          ]);
        } else {
          Alert.alert("Error", "No user data found");
        }
      },
      (error) => {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data");
      },
    );

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [userId, stepsGoal, waterGoal]);

  const incrementMetric = (index: number) => {
    const updatedMetrics = [...metrics];

    if (typeof updatedMetrics[index].value === "number") {
      updatedMetrics[index].value = (updatedMetrics[index].value as number) + 1;

      if (updatedMetrics[index].target) {
        updatedMetrics[index].percentage = Math.min(
          100,
          ((updatedMetrics[index].value as number) /
            (updatedMetrics[index].target as number)) *
            100,
        );
      }

      setMetrics(updatedMetrics);
    }
  };

  const renderProgressBar = (percentage: number, color: string) => {
    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {userData?.name || "User"}!
          </Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={40} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Today's Progress</Text>

      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            style={styles.metricCard}
            onPress={() => incrementMetric(index)}
          >
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${metric.color}20` },
                ]}
              >
                <Ionicons
                  name={metric.icon as any}
                  size={24}
                  color={metric.color}
                />
              </View>
              <Text style={styles.metricValue}>
                {metric.value}{" "}
                <Text style={styles.metricUnit}>{metric.unit}</Text>
              </Text>
            </View>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            {metric.target && (
              <View style={styles.targetContainer}>
                <Text style={styles.targetText}>
                  Target: {metric.target} {metric.unit}
                </Text>
                {metric.percentage !== undefined &&
                  renderProgressBar(metric.percentage, metric.color)}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Weekly Steps</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={stepData}
          width={Dimensions.get("window").width - 40}
          height={180}
          chartConfig={{
            backgroundColor: "#ffffff",
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
              stroke: "#5CB85C",
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="water-outline" size={26} color="#fff" />
            <Text style={styles.actionText}>Add Water</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="fitness-outline" size={26} color="#fff" />
            <Text style={styles.actionText}>Start Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={26} color="#fff" />
            <Text style={styles.actionText}>Health Tips</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#666",
  },
  profileButton: {
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "#333",
    marginVertical: 12,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#666",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "#333",
  },
  metricUnit: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#666",
  },
  targetContainer: {
    marginTop: 6,
  },
  targetText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#888",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    width: "100%",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    marginTop: 4,
    textAlign: "center",
  },
});

export default HealthDashboard;
