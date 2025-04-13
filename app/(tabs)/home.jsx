import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Sliders from "../../components/Home/Sliders";
import Category from "../../components/Home/Category";
import PetListByCategory from "../../components/Home/PetListByCategory";

export default function Home() {
  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}>
      {/* Headers */}
      <Header />

      {/* Sliders */}
      <Sliders />

      {/* Category + List of Pets */}
      <PetListByCategory />

      {/* Add new Pet Option */}
    </View>
  );
}
