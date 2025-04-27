import { View, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GetFavList, UpdateFavList } from "../../shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors";

export default function MarkFav({ pet }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavList = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const favData = await GetFavList(user);
      setFavList(favData?.favorites || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
      setFavList([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavList();
  }, [fetchFavList]);

  const AddToFav = async () => {
    if (!user || !pet?.id) return;
    const newFavList = [...favList, pet.id];
    setFavList(newFavList);
    try {
      await UpdateFavList(user, newFavList);
    } catch (error) {
      console.error("Failed to add favorite:", error);
      setFavList(favList.filter((id) => id !== pet.id));
    }
  };

  const RemoveFromFav = async () => {
    if (!user || !pet?.id) return;
    const newFavList = favList.filter((favId) => favId !== pet.id);
    setFavList(newFavList);
    try {
      await UpdateFavList(user, newFavList);
    } catch (error) {
      console.error("Xoá khỏi danh sách yêu thích thất bại:", error);
      setFavList([...favList, pet.id]);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" color={Colors.PRIMARY || "gray"} />;
  }

  const isFavorited = pet?.id ? favList.includes(pet.id) : false;

  return (
    <View>
      {isFavorited ? (
        <Pressable onPress={RemoveFromFav}>
          <MaterialCommunityIcons name="heart" size={30} color="red" />
        </Pressable>
      ) : (
        <Pressable onPress={AddToFav}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={30}
            color="black"
          />
        </Pressable>
      )}
    </View>
  );
}
