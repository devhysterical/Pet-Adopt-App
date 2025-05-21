import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Sliders from "../../components/Home/Sliders";
import Category from "../../components/Home/Category";
import PetListByCategory from "../../components/Home/PetListByCategory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View
      style={{
        padding: 15,
        marginTop: 15,
      }}>
      {/* Headers */}
      <Header />

      {/* Sliders */}
      <Sliders />

      {/* Category + List of Pets */}
      <PetListByCategory />

      {/* Add new Pet  */}
      <Link style={styles.addNewPetContainer} href={"/add-new-pet"}>
        <MaterialIcons name="pets" size={24} color="black" />
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 15,
          }}>
          Thêm thú cưng mới
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderColor: Colors.BLACK,
    justifyContent: "center",
    textAlign: "center",
  },
});
