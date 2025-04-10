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
      <Text style={{ fontSize: 20, fontFamily: "outfit-bold" }}>
        Welcome to the Pet Adoption App!
      </Text>
    </View>
  );
}
