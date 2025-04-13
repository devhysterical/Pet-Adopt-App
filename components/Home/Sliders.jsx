import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "./../../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Sliders() {
  const [slidersList, setSlidersList] = useState([]);
  // Get Sliders from Firestore
  const getSliders = async () => {
    setSlidersList([]);
    const snapShot = await getDocs(collection(db, "Sliders"));
    snapShot.forEach((doc) => {
      setSlidersList((prev) => [...prev, doc.data()]);
    });
  };

  useEffect(() => {
    getSliders();
  }, []);

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        data={slidersList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.slidersImage}
            />
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  slidersImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
  },
});
