import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(false);
  // Lấy danh sách thú cưng theo danh mục từ Firestore
  const getPetListByCategory = async (category) => {
    setLoading(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));

    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      // console.log(doc.data());
      setPetList((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };

  useEffect(() => {
    getPetListByCategory("Dogs");
  }, []);
  return (
    <View>
      <Category category={(value) => getPetListByCategory(value)} />
      <FlatList
        style={{
          marginTop: 15,
        }}
        data={petList}
        // numColumns={2}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => getPetListByCategory("Dogs")}
        renderItem={({ item, index }) => <PetListItem pets={item} />}
      />
    </View>
  );
}
