import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors";
// import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  // const [chatPartnerName, setChatPartnerName] = useState("Chat");

  const chatId = params?.id;

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerStyle: {
        // backgroundColor: Colors.PRIMARY_LIGHT,
      },
      headerTintColor: Colors.BLACK,
    });

    if (!chatId || !user?.primaryEmailAddress?.emailAddress) {
      setLoading(false);
      navigation.setOptions({ headerTitle: "Chat không hợp lệ" });
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
            // setChatPartnerName(otherUser.name);
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
        senderName: user.fullName || user.firstName || "Người gửi",
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
            styles.messageRow,
            isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
          ]}>
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            ]}>
            {!isMyMessage && item.senderName && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}>
              {item.text}
            </Text>
            <Text
              style={[
                styles.timestamp,
                isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
              ]}>
              {item.timestamp
                ?.toDate()
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>
      );
    },
    [user?.primaryEmailAddress?.emailAddress]
  );

  if (loading && messages.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
      </View>
    );
  }

  if (!chatId && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy ID cuộc trò chuyện.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesListContent}
        inverted={messages.length > 0}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centered}>
              <Text style={styles.emptyChatText}>
                Chưa có tin nhắn nào.{"\n"}Hãy bắt đầu cuộc trò chuyện!
              </Text>
            </View>
          ) : null
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={Colors.GRAY}
          multiline
        />
        <Pressable
          onPress={sendMessage}
          disabled={!text.trim()}
          style={({ pressed }) => [
            styles.sendButton,
            !text.trim() && styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}>
          {/* <Ionicons name="send" size={20} color={Colors.WHITE} /> */}
          <Text style={styles.sendButtonText}>Gửi</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.GRAY,
  },
  errorText: {
    fontSize: 16,
    color: Colors.RED,
    textAlign: "center",
  },
  emptyChatText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.GRAY,
    lineHeight: 24,
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 5,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: "80%",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessageBubble: {
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderBottomLeftRadius: 5,
  },
  senderName: {
    fontSize: 13,
    color: Colors.PRIMARY,
    marginBottom: 4,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: Colors.WHITE,
  },
  otherMessageText: {
    color: Colors.DARK_GRAY,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  myTimestamp: {
    color: Colors.WHITE_ALPHA_70,
  },
  otherTimestamp: {
    color: Colors.GRAY,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.WHITE,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY_BACKGROUND,
    borderColor: Colors.MEDIUM_GRAY,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 120,
    color: Colors.DARK_GRAY,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.MEDIUM_GRAY,
  },
  sendButtonPressed: {
    backgroundColor: Colors.PRIMARY_DARK,
  },
  sendButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});
