import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native"; // Thêm Alert, ActivityIndicator
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Thêm doc, deleteDoc
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import PetListItem from "./../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Bài đăng của tôi",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTintColor: "#000",
    });
    if (user) {
      GetUserPost();
    } else {
      setUserPostList([]); // Nếu không có user, set danh sách rỗng
    }
  }, [user]);

  const GetUserPost = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setUserPostList([]);
      return;
    }
    setLoading(true);
    setUserPostList([]); // Reset danh sách trước khi lấy dữ liệu mới
    try {
      const petsCollectionRef = collection(db, "Pets");
      const q = query(
        petsCollectionRef,
        where("userEmail", "==", user.primaryEmailAddress.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id }); // lưu cả doc.id
      });
      setUserPostList(posts);
    } catch (error) {
      console.error("Error fetching user posts: ", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bài đăng.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      "Xác nhận xoá",
      "Bạn có chắc chắn muốn xoá bài đăng này không?",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDoc(doc(db, "Pets", postId));
              setUserPostList((prevList) =>
                prevList.filter((post) => post.id !== postId)
              );
              Alert.alert("Thành công", "Đã xoá bài đăng.");
            } catch (error) {
              console.error("Error deleting post: ", error);
              Alert.alert("Lỗi", "Không thể xoá bài đăng.");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading && userPostList.length === 0) {
    // Chỉ hiển thị loading indicator khi đang tải lần đầu
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
        <Text style={{ fontSize: 18, textAlign: "center", color: Colors.GRAY }}>
          Vui lòng đăng nhập để xem các bài đăng của bạn.
        </Text>
      </View>
    );
  }

  if (userPostList.length === 0 && !loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
        <Text style={{ fontSize: 18, textAlign: "center", color: Colors.GRAY }}>
          Bạn chưa có bài đăng nào.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}>
      <FlatList
        data={userPostList}
        numColumns={2}
        // refreshing={loading}
        // onRefresh={GetUserPost}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View style={styles.postItemContainer}>
            <PetListItem pets={item} />
            <Pressable
              style={styles.deleteBtn}
              onPress={() => handleDeletePost(item?.id)}>
              <Text style={styles.deleteBtnText}>Xoá bài đăng</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          loading && userPostList.length > 0 ? (
            <ActivityIndicator
              style={{ margin: 10 }}
              size="small"
              color={Colors.PRIMARY}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  postItemContainer: {
    margin: 5,
  },
  deleteBtn: {
    backgroundColor: Colors.PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  deleteBtnText: {
    color: Colors.BLACK,
    fontFamily: "outfit-medium",
  },
});
