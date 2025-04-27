import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Header() {
  const { user } = useUser();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      <View>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
          }}>
          Xin chào,
        </Text>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 24,
          }}>
          {user?.fullName}
        </Text>
      </View>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
        }}
      />
    </View>
  );
}
