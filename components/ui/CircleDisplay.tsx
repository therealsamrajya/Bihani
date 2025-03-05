import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { CircleDisplayProps } from "@/types";

const CircleDisplay: React.FC<CircleDisplayProps> = ({
  value,
  unit,
  size = 200,
  backgroundColor = "#4A90E2",
  valueColor = "white",
  unitColor = "white",
  valueSize = 30,
  unitSize = 20,
  style = {},
}) => {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text
        className="font-PoppinsBold"
        style={[styles.value, { fontSize: valueSize, color: valueColor }]}
      >
        {value}
      </Text>
      <Text
        className="font-PoppinsBold"
        style={[
          styles.unit,
          { fontSize: unitSize, color: unitColor, opacity: 0.8 },
        ]}
      >
        {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginBottom: 30,
  },
  value: {
    fontWeight: "bold",
  },
  unit: {
    opacity: 0.8,
  },
});

export default CircleDisplay;
