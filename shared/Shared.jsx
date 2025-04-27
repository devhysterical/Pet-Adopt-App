import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./../config/FirebaseConfig";

export const GetFavList = async (user) => {
  if (!user?.primaryEmailAddress?.emailAddress) {
    console.warn("GetFavList: Email người dùng không tồn tại.");
    return { favorites: [] };
  }
  const docRef = doc(db, "UserFavPet", user.primaryEmailAddress.emailAddress);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    const initialData = {
      email: user.primaryEmailAddress.emailAddress,
      favorites: [],
    };
    try {
      await setDoc(docRef, initialData);
      console.log(
        "Khởi tạo danh sách yêu thích cho:",
        user.primaryEmailAddress.emailAddress
      );
      return initialData;
    } catch (e) {
      console.error("Lỗi khi tạo danh sách yêu thích:", e);
      return { favorites: [] };
    }
  }
};

export const UpdateFavList = async (user, favorites) => {
  if (!user?.primaryEmailAddress?.emailAddress) {
    console.warn("UpdateFavList: Email người dùng không tồn tại.");
    return;
  }
  const docRef = doc(db, "UserFavPet", user.primaryEmailAddress.emailAddress);
  try {
    await updateDoc(docRef, {
      favorites: favorites,
    });
    console.log(
      "Cập nhật danh sách yêu thích thành công:",
      user.primaryEmailAddress.emailAddress
    );
  } catch (e) {
    console.error("Lỗi khi cập nhật danh sách yêu thích:", e);
  }
};
