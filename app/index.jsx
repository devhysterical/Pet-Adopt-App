import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}>
      <Link href={"/login"}>
        <Text style={{ fontSize: 20, fontFamily: "outfit-bold" }}>
          Go to login screen
        </Text>
      </Link>
    </View>
  );
}
