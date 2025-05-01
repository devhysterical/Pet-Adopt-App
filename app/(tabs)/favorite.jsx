import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { GetFavList } from "../../shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function Favorite() {
  const { user } = useUser();
  const [favIDs, setFavIDs] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFavIDs = useCallback(async () => {
    if (!user) {
      setFavIDs([]);
      setFavPetList([]);
      return [];
    }
    try {
      const result = await GetFavList(user);
      const currentFavIDs = result?.favorites || [];
      setFavIDs(currentFavIDs);
      return currentFavIDs;
    } catch (error) {
      console.error("Lỗi khi lấy ID thú cưng yêu thích:", error);
      setFavIDs([]);
      setFavPetList([]);
      return [];
    }
  }, [user]);

  const fetchFavPetDetails = useCallback(async (currentIDs) => {
    if (!currentIDs || currentIDs.length === 0) {
      setFavPetList([]);
      return;
    }
    try {
      const q = query(collection(db, "Pets"), where("id", "in", currentIDs));
      const snapShot = await getDocs(q);

      const pets = [];
      snapShot.forEach((doc) => {
        pets.push({ id: doc.id, ...doc.data() });
      });
      setFavPetList(pets);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thú cưng yêu thích:", error);
      setFavPetList([]);
    }
  }, []);

  const loadFavoriteData = useCallback(async () => {
    try {
      const currentIDs = await fetchFavIDs();
      if (currentIDs && currentIDs.length > 0) {
        await fetchFavPetDetails(currentIDs);
      } else {
        setFavPetList([]);
      }
    } catch (error) {
      setFavPetList([]);
    }
  }, [fetchFavIDs, fetchFavPetDetails]);

  useEffect(() => {
    setIsLoading(true);
    loadFavoriteData().finally(() => {
      setIsLoading(false);
    });
  }, [user, loadFavoriteData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadFavoriteData();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadFavoriteData]);

  const renderFavoriteItem = ({ item }) => <PetListItem pets={item} />;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu thích</Text>
      <FlatList
        data={favPetList}
        numColumns={3}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              Chưa có thú cưng yêu thích nào.
            </Text>
          </View>
        )}
        contentContainerStyle={
          favPetList.length === 0
            ? styles.emptyListContainer
            : styles.listContentContainer
        }
        columnWrapperStyle={styles.row}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: Colors.WHITE || "#fff",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-around",
    marginBottom: 15,
  },
});
