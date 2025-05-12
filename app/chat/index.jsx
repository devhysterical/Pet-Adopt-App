import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react"; // Thêm useCallback
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  addDoc, // Thêm addDoc
  onSnapshot, // Thêm onSnapshot
  query, // Thêm query
  orderBy, // Thêm orderBy
  Timestamp, // Thêm Timestamp để tạo timestamp chuẩn
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors"; // Giả sử bạn có file Colors

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatPartnerName, setChatPartnerName] = useState("Chat");

  const chatId = params?.id;
  useEffect(() => {
    if (!chatId || !user?.primaryEmailAddress?.emailAddress) {
      setLoading(false);
      return;
    }

    const GetUserDetails = async () => {
      try {
        const docRef = doc(db, "Chat", chatId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const res = docSnap.data();
          const otherUser = res?.users?.find(
            (item) => item.email !== user.primaryEmailAddress.emailAddress
          );
          if (otherUser?.name) {
            setChatPartnerName(otherUser.name);
            navigation.setOptions({
              headerTitle: otherUser.name,
            });
          } else {
            navigation.setOptions({ headerTitle: "Chat" });
          }
        } else {
          console.log("No such chat document!");
          navigation.setOptions({ headerTitle: "Chat không tồn tại" });
        }
      } catch (error) {
        console.error(
          "Lỗi lấy thông tin người dùng cho tiêu đề khung chat:",
          error
        );
        navigation.setOptions({ headerTitle: "Lỗi tải chat" });
      }
    };

    GetUserDetails();
  }, [chatId, navigation, user?.primaryEmailAddress?.emailAddress]);

  const sendMessage = async () => {
    if (!text.trim() || !chatId || !user?.primaryEmailAddress?.emailAddress) {
      if (!chatId) console.error("Chat ID is missing");
      return;
    }
    try {
      await addDoc(collection(doc(db, "Chat", chatId), "messages"), {
        text: text.trim(),
        sender: user.primaryEmailAddress.emailAddress,
        senderName: user.fullName || "Người gửi",
        timestamp: Timestamp.now(),
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const messagesCollectionRef = collection(
      doc(db, "Chat", chatId),
      "messages"
    );
    const q = query(messagesCollectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const renderMessageItem = useCallback(
    ({ item }) => {
      const isMyMessage =
        item.sender === user?.primaryEmailAddress?.emailAddress;
      return (
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.otherMessage,
          ]}>
          {!isMyMessage && (
            <Text style={styles.senderName}>
              {item.senderName || item.sender.split("@")[0]}
            </Text>
          )}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {item.timestamp
              ?.toDate()
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      );
    },
    [user?.primaryEmailAddress?.emailAddress]
  );

  if (loading && messages.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text>Đang tải tin nhắn...</Text>
      </View>
    );
  }

  if (!chatId) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy ID cuộc trò chuyện.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.centeredText}>Chưa có tin nhắn nào.</Text>
          ) : null
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          multiline
        />
        <Button title="Gửi" onPress={sendMessage} disabled={!text.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centeredText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: Colors.GRAY,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginVertical: 4,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },
  senderName: {
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 2,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 16,
    color: "black",
  },
  myMessage: {
    messageText: {
      color: "white",
    },
  },
  timestamp: {
    fontSize: 10,
    color: Colors.GRAY,
    alignSelf: "flex-end",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
});
