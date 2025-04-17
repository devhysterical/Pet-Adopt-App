import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  return (
    <View>
      {/* Pet information */}
      <PetInfo pet={pet} />

      {/* Pet SubInfo */}
      <PetSubInfo pet={pet} />

      {/* About */}

      {/* Owner Details */}

      {/* Adopt Button */}
    </View>
  );
}
