import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../PetDetails/MarkFav";

export default function PetListItem({ pets }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/pet-details", params: pets })}
      style={{
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
      }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <MarkFav pet={pets} />
      </View>
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
            backgroundColor: Colors.PRIMARY_LIGHT,
            borderRadius: 10,
            alignItems: "center",
            textAlign: "center",
          }}>
          {pets?.age}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
