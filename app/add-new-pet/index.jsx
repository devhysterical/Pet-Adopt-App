import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import * as FileSystem from "expo-file-system";

export default function AddNewPet() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    category: "Dogs",
    sex: "Male",
  });
  const [gender, setGender] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Lấy danh sách danh mục từ Firestore
  const getCategories = async () => {
    setCategoryList([]);
    const snapShot = await getDocs(collection(db, "Categorys"));
    snapShot.forEach((doc) => {
      setCategoryList((prev) => [...prev, doc.data()]);
    });
  };

  // Hàm xử lý nhập dữ liệu vào form
  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = async () => {
    if (Object.keys(formData).length !== 8 || !image) {
      alert("Vui lòng nhập đầy đủ thông tin thú cưng và chọn ảnh!");
      return;
    }
    setIsLoading(true);
    try {
      await SaveFormData(image);
      alert("Thêm thú cưng thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi lưu thú cưng:", error);
      alert("Đã xảy ra lỗi khi thêm thú cưng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm lấy ảnh từ thư viện ảnh và chuyển thành Base64
  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const imageMimeType = result.assets[0].mimeType || "image/jpeg";
        setImage(`data:${imageMimeType};base64,${base64}`);
      } catch (error) {
        console.error("Lỗi chuyển ảnh sang Base64:", error);
        alert("Không thể xử lý ảnh. Vui lòng thử lại.");
        setImage(null);
      }
    }
  };

  const SaveFormData = async (base64ImageUrl) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: base64ImageUrl,
      username: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      id: docId,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Thêm thú cưng mới",
    });
    getCategories();
  }, []);

  return (
    <ScrollView
      style={{
        padding: 15,
      }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}>
        Thêm thú cưng cho thuê
      </Text>
      {/* Ảnh thú cưng */}
      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            source={require("../../assets/images/place-holder.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
            }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
            }}
          />
        )}
      </Pressable>
      {/* Tên thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên thú cưng</Text>
        <TextInput
          placeholder="Nhập tên thú cưng"
          style={styles.input}
          value={formData.name || ""}
          onChangeText={(value) => handleInputChange("name", value)}
        />
      </View>
      {/* Danh mục thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nhóm thú cưng</Text>
        <Picker
          style={styles.input}
          selectedValue={selectedCategory || formData.category}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            handleInputChange("category", itemValue);
          }}>
          {categoryList.map((category, index) => (
            <Picker.Item
              label={category.name}
              value={category.name}
              key={index}
            />
          ))}
        </Picker>
      </View>
      {/* Loại thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giống loài</Text>
        <TextInput
          placeholder="Giống loài"
          style={styles.input}
          value={formData.breed || ""}
          onChangeText={(value) => handleInputChange("breed", value)}
        />
      </View>
      {/* Tuổi thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tuổi</Text>
        <TextInput
          placeholder="Nhập tuổi thú cưng"
          style={styles.input}
          value={formData.age || ""}
          onChangeText={(value) => handleInputChange("age", value)}
        />
      </View>
      {/* Giới tính thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giới tính</Text>
        <Picker
          style={styles.input}
          selectedValue={gender || formData.sex}
          onValueChange={(itemValue, itemIndex) => {
            setGender(itemValue);
            handleInputChange("sex", itemValue);
          }}>
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      {/* Cân nặng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cân nặng</Text>
        <TextInput
          placeholder="Nhập cân nặng thú cưng"
          style={styles.input}
          keyboardType="numeric"
          value={formData.weight || ""}
          onChangeText={(value) => handleInputChange("weight", value)}
        />
      </View>
      {/* Địa chỉ thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          placeholder="Nhập địa chỉ của thú cưng"
          style={styles.input}
          value={formData.address || ""}
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>
      {/* Mô tả thú cưng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          placeholder="Nhập mô tả thú cưng"
          style={styles.input}
          multiline={true}
          numberOfLines={5}
          value={formData.about || ""}
          onChangeText={(value) => handleInputChange("about", value)}
        />
      </View>

      <TouchableOpacity
        style={styles.btnSubmit}
        disabled={isLoading}
        onPress={onSubmit}>
        {isLoading ? (
          <ActivityIndicator size={"large"} color={Colors.WHITE} />
        ) : (
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 20,
              textAlign: "center",
              color: Colors.WHITE,
            }}>
            Xác nhận
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    fontFamily: "outfit",
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  btnSubmit: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginVertical: 10,
    marginBottom: 50,
  },
});
