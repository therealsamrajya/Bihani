import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuthStateListener } from "@/utils/useAuthStateListener";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useAuthStateListener();

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();

    // Set a minimum loading time of 3 seconds
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 8000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const [fontsLoaded] = useFonts({
    PoppinsBold: require("../assets/fonts/PoppinsBold.ttf"),
    PoppinsRegular: require("../assets/fonts/PoppinsRegular.ttf"),
    PoppinsThin: require("../assets/fonts/PoppinsThin.ttf"),
  });

  // Show loading screen until fonts are ready AND minimum time has passed
  if (!fontsLoaded || !isReady) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
