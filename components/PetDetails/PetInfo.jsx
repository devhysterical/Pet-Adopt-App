import { View, Text, Image } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function PetInfo({ pet }) {
  return (
    <View>
      <Image
        source={{ uri: pet.imageUrl }}
        style={{
          width: "100%",
          height: 400,
          objectFit: "cover",
        }}
        alt={pet.name}
      />
      <View
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 25,
            }}>
            {pet?.name}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 15,
              color: "#4B5563",
            }}>
            {pet?.address}
          </Text>
        </View>
        <MaterialCommunityIcons name="heart-outline" size={30} color="black" />
      </View>
    </View>
  );
}
