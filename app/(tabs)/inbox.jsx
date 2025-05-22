import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "../../components/Inbox/UserItem";
import Colors from "../../constants/Colors";

export default function Inbox() {
  const { user } = useUser();
  const [chatList, setChatList] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  // Lấy danh sách các cuộc chat mà người dùng hiện tại tham gia
  const GetChatList = useCallback(async () => {
    if (!currentUserEmail) {
      setChatList([]);
      setDisplayedUsers([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "Chat"),
        where("userIds", "array-contains", currentUserEmail)
      );
      const querySnapshot = await getDocs(q);
      const fetchedChats = [];
      querySnapshot.forEach((doc) => {
        fetchedChats.push({ firestoreDocId: doc.id, ...doc.data() });
      });
      setChatList(fetchedChats);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chat:", error);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail]);

  // Xử lý chatList để tạo displayedUsers
  useEffect(() => {
    if (!currentUserEmail) {
      setDisplayedUsers([]);
      return;
    }

    const mappedUsers = chatList
      .map((chatItem) => {
        // Tìm người dùng kia trong mảng users của cuộc chat
        const otherUserDetails = chatItem?.users?.find(
          (u) => u.email !== currentUserEmail
        );

        if (otherUserDetails) {
          return {
            chatDocumentId: chatItem.firestoreDocId || chatItem.id,
            name: otherUserDetails.name,
            imageUrl: otherUserDetails.imageUrl,
            email: otherUserDetails.email,
          };
        }
        return null;
      })
      .filter(Boolean);

    setDisplayedUsers(mappedUsers);
  }, [chatList, currentUserEmail]);

  useEffect(() => {
    if (user) {
      GetChatList();
    }
  }, [user, GetChatList]);

  if (loading && displayedUsers.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Hộp thư</Text>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          refreshing={loading}
          onRefresh={GetChatList}
          data={displayedUsers}
          renderItem={({ item }) => <UserItem userInfo={item} />}
          keyExtractor={(item, index) =>
            item.chatDocumentId || item.email || index.toString()
          }
          ListEmptyComponent={() =>
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Không có cuộc trò chuyện nào.
                </Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    color: Colors.BLACK,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.GRAY,
  },
});
