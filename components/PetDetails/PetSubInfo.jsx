import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }) {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}>
        {/* ROW 1 */}
        <PetSubInfoCard
          icon={require("./../../assets/images/schedule.png")}
          title="Age"
          value={pet?.age}
        />
        {/* ROW 2 */}
        <PetSubInfoCard
          icon={require("./../../assets/images/weight.png")}
          title="Weight"
          value={pet?.weight}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}>
        {/* ROW 3 */}
        <PetSubInfoCard
          icon={require("./../../assets/images/gender.png")}
          title="Gender"
          value={pet?.sex}
        />
        {/* ROW 4 */}
        <PetSubInfoCard
          icon={require("./../../assets/images/card.png")}
          title="Breed"
          value={pet?.breed}
        />
      </View>
    </View>
  );
}
