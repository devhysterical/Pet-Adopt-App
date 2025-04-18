import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import { ScrollView } from "react-native";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";

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
      <ScrollView>
        {/* Pet information */}
        <PetInfo pet={pet} />

        {/* Pet SubInfo */}
        <PetSubInfo pet={pet} />

        {/* About */}
        <AboutPet pet={pet} />

        {/* Owner Details */}
        <OwnerInfo pet={pet} />
        <View style={{ height: 100 }}></View>
      </ScrollView>
      {/* Adopt Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.btnAdopt}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}>
            Adopt Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAdopt: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
