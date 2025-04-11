import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { user } = useUser();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}>
      {user ? <Redirect href={"/(tabs)/home"} /> : <Redirect href={"/login"} />}
    </View>
  );
}
