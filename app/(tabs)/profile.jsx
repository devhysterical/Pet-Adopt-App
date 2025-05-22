import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function Profile() {
  const Menu = [
    {
      id: 1,
      name: "Thêm thú cưng",
      icon: "add-circle",
      path: "/add-new-pet",
    },
    {
      id: 2,
      name: "Bài đăng của tôi",
      icon: "document-text",
      path: "/user-post",
    },
    {
      id: 3,
      name: "Yêu thích",
      icon: "heart",
      path: "/(tabs)/favorite",
    },
    {
      id: 4,
      name: "Hộp thư",
      icon: "mail",
      path: "/(tabs)/inbox",
    },
    {
      id: 5,
      name: "Đăng xuất",
      icon: "log-out",
    },
  ];
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();
  const onPressMenu = (item) => {
    if (item?.path) {
      router.push(item?.path);
    } else if (item?.id === 5) {
      signOut();
      router.push("/login");
      return;
    }
  };
  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
          textAlign: "center",
        }}>
        Trang cá nhân
      </Text>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginVertical: 25,
          // marginTop: 15,
          // padding: 15,
        }}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 99,
          }}
        />
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            marginTop: 5,
          }}>
          {user?.fullName}
        </Text>
        <Text
          style={{
            fontFamily: "outfit-regular",
            fontSize: 15,
            color: Colors.GRAY,
            marginTop: 5,
          }}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <FlatList
        data={Menu}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={index}
            style={{
              marginVertical: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10,
            }}>
            <Ionicons
              name={item?.icon}
              size={30}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.PRIMARY_LIGHT,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 20,
              }}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
