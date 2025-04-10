import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function LoginScreen() {
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}>
      <Image
        source={require("../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: 500,
          resizeMode: "cover",
        }}
      />
      <View
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "outfit-bold",
            textAlign: "center",
          }}>
          Are you ready to find your new best friend?{"\n"}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            fontFamily: "outfit",
            textAlign: "center",
            color: Colors.GRAY,
          }}>
          Let's get started by creating an account and finding your perfect pet!
          {"\n"}
        </Text>
        <Pressable
          style={{
            padding: 14,
            marginTop: 100,
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 15,
          }}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 20,
              textAlign: "center",
            }}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
