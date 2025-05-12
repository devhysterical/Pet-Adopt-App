import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import { ScrollView } from "react-native";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const nav = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  const InitialChat = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const otherEmail = pet?.userEmail;

    const docId1 = `${userEmail}_${otherEmail}`;
    const docId2 = `${otherEmail}_${userEmail}`;

    const q = query(
      collection(db, "Chat"),
      where("id", "in", [docId1, docId2])
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const chatDoc = querySnapshot.docs[0];
      router.push({
        pathname: "/chat",
        params: {
          id: chatDoc.id,
        },
      });
      return;
    }

    const newChatId = docId1;
    await setDoc(doc(db, "Chat", newChatId), {
      id: newChatId,
      users: [
        {
          email: userEmail,
          imageUrl: user?.imageUrl,
          name: user?.fullName,
        },
        {
          email: otherEmail,
          imageUrl: pet?.userImage,
          name: pet?.userName,
        },
      ],
      userIds: [userEmail, otherEmail],
    });
    router.push({
      pathname: "/chat",
      params: {
        id: newChatId,
      },
    });
  };

  useEffect(() => {
    nav.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  return (
    <View>
      <ScrollView>
        {/* Thông tin chi tiết thú cưng */}
        <PetInfo pet={pet} />

        {/* Thông tin phụ thú cưng */}
        <PetSubInfo pet={pet} />

        {/* Giới thiệu về thú cưng */}
        <AboutPet pet={pet} />

        {/* Thông tin chủ sở hữu */}
        <OwnerInfo pet={pet} />
        <View style={{ height: 100 }}></View>
      </ScrollView>
      {/* Nút nhận nuôi */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={InitialChat} style={styles.btnAdopt}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}>
            Nhận nuôi {pet?.name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAdopt: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
