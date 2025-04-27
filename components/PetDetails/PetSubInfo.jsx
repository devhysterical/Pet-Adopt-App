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
          title="Tuổi"
          value={pet?.age}
        />
        {/* ROW 2 */}
        <PetSubInfoCard
          icon={require("./../../assets/images/weight.png")}
          title="Cân nặng"
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
          title="Giới tính"
          value={pet?.sex}
        />
        {/* ROW 4 */}
        <PetSubInfoCard
          icon={require("./../../assets/images/card.png")}
          title="Giống loài"
          value={pet?.breed}
        />
      </View>
    </View>
  );
}
