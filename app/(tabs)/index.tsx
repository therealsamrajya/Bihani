import { View, ScrollView, StyleSheet, Text } from "react-native";
import React from "react";
import StepsCalculator from "@/components/steps-calculator/StepsCalculator";
import WaterCounter from "@/components/water-counter/WaterCounter";

export default function Index() {
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your daily activities</Text>
      </View>

      <View style={styles.trackerContainer}>
        <StepsCalculator />
      </View>

      <View style={styles.trackerContainer}>
        <WaterCounter />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  trackerContainer: {
    marginBottom: 20,
  },
});
