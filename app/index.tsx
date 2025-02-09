import { Text, View } from "react-native";
import Button from "@/components/ui/Button";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text className="text-3xl font-PoppinsBold text-red-600">
        Hello test test sam
      </Text>
      <Button title="Press me" onPress={() => console.log("Pressed")} />
    </View>
  );
}
