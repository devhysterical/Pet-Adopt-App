import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function PetListItem({ pets }) {
  return (
    <View
      style={{
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
      }}>
      <Image
        source={{ uri: pets.imageUrl }}
        style={{
          width: 100,
          height: 100,
          objectFit: "cover",
          borderRadius: 10,
          alignItems: "center",
        }}
      />
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 15,
          alignItems: "center",
          textAlign: "center",
        }}>
        {pets?.name}
      </Text>
      <View>
        <Text
          style={{
            fontFamily: "outfit",
            textAlign: "center",
            alignItems: "center",
            color: Colors.GRAY,
          }}>
          {pets?.breed}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            color: Colors.BLACK,
            backgroundColor: Colors.LIGHT_PRIMARY,
            borderRadius: 10,
            alignItems: "center",
            textAlign: "center",
          }}>
          {pets?.age}
        </Text>
      </View>
    </View>
  );
}
