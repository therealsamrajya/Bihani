import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CircleDisplay from "./ui/CircleDisplay";

const WaterCounter = () => {
  const [waterCount, setWaterCount] = useState(0);

  const incrementWater = () => {
    setWaterCount(waterCount + 1);
  };

  const decrementWater = () => {
    if (waterCount > 0) {
      setWaterCount(waterCount - 1);
    }
  };

  return (
    <View className=" border border-black" style={styles.container}>
      <CircleDisplay
        value={waterCount}
        unit="Glasses"
        size={100}
        backgroundColor="#4A90E2"
        valueColor="white"
        unitColor="white"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={decrementWater}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={incrementWater}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 185,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },

  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default WaterCounter;
