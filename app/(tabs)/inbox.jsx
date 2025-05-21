import { View, Text, FlatList, ActivityIndicator } from "react-native"; // Thêm ActivityIndicator
import React, { useEffect, useState, useCallback } from "react"; // Thêm useCallback
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View
      style={{
        padding: 15,
        marginTop: 15,
        flex: 1,
      }}>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 28,
          marginBottom: 10,
          textAlign: "center",
        }}>
        Hộp thư
      </Text>
      <FlatList
        style={{
          marginTop: 15,
        }}
        refreshing={loading}
        onRefresh={GetChatList}
        data={displayedUsers}
        renderItem={({ item }) => <UserItem userInfo={item} />}
        keyExtractor={(item, index) =>
          item.chatDocumentId || item.email || index.toString()
        }
        ListEmptyComponent={() =>
          !loading && (
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: Colors.GRAY,
              }}>
              Không có cuộc trò chuyện nào.
            </Text>
          )
        }
      />
    </View>
  );
}
