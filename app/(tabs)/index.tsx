import { View } from "react-native";

import StepsCalculator from "@/components/StepsCalculator";
import React from "react";
import WaterCounter from "@/components/WaterCounter";
export default function Index() {
  return (
    <View
      className="bg-background"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="flex flex-row items-center justify-center">
        <StepsCalculator />
        <WaterCounter />
      </View>
    </View>
  );
}
