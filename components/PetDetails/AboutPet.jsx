import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";

export default function AboutPet({ pet }) {
  const [readMore, setReadMore] = useState(true);
  return (
    <View
      style={{
        padding: 20,
      }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}>
        About {pet?.name}
      </Text>
      <Text
        numberOfLines={readMore ? 3 : 20}
        style={{
          fontFamily: "outfit",
          fontSize: 13,
          color: Colors.GRAY,
        }}>
        {pet?.about}
      </Text>
      {/* Show more */}
      {readMore && (
        <Pressable onPress={() => setReadMore(false)}>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 12,
              color: Colors.SECONDARY,
            }}>
            More
          </Text>
        </Pressable>
      )}
      {/* Show less */}
      {!readMore && (
        <Pressable onPress={() => setReadMore(true)}>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 12,
              color: Colors.SECONDARY,
            }}>
            Less
          </Text>
        </Pressable>
      )}
    </View>
  );
}
