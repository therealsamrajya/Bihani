import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { Text } from "react-native";
import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

export default function RootLayout() {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);
  const [fontsLoaded] = useFonts({
    PoppinsBold: require("../assets/fonts/PoppinsBold.ttf"),
    PoppinsRegular: require("../assets/fonts/PoppinsRegular.ttf"),
    PoppinsThin: require("../assets/fonts/PoppinsThin.ttf"),
  });

  // Show loading screen until fonts are ready
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
