import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import { Text } from "react-native";

export default function RootLayout() {
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
      <Stack.Screen name="index" options={{ title: "Index" }} />
    </Stack>
  );
}
