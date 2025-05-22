import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function UserItem({ userInfo }) {
  const router = useRouter();

  // Hàm xử lý khi người dùng nhấn vào item
  const handlePress = () => {
    if (userInfo?.chatDocumentId) {
      router.push({
        pathname: "/chat",
        params: { id: userInfo.chatDocumentId },
      });
    } else {
      console.warn("Chat document ID is missing for user:", userInfo?.name);
      // Hiển thị thông báo
      alert("Không thể mở cuộc trò chuyện. Vui lòng thử lại sau.");
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image
        source={{
          uri:
            userInfo?.imageUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }}
        style={styles.avatar}
      />
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userInfo?.name || "Người dùng"}</Text>
        {/*
        - Chức năng hiển thị tin nhắn cuối cùng
        - Chưa hoàn thiện
         */}
        {/* <Text style={styles.lastMessage}>
          {userInfo?.lastMessage || "Không có tin nhắn"}
        </Text> */}
      </View>
      {/* 
      - Hiển thị timestamp
      - Chưa hoàn thiện
      */}
      {/* <Text style={styles.timestamp}>
        {userInfo?.lastMessageTimestamp
          ? new Date(
              userInfo.lastMessageTimestamp.seconds * 1000
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : ""}
      </Text> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontFamily: "outfit-medium",
    fontSize: 17,
    color: Colors.DARK_GRAY,
  },
  // lastMessage: {
  //   fontFamily: "outfit",
  //   fontSize: 14,
  //   color: Colors.GRAY,
  //   marginTop: 2,
  // },
  // timestamp: {
  //   fontFamily: "outfit",
  //   fontSize: 12,
  //   color: Colors.GRAY,
  //   marginLeft: 10,
  // },
});
