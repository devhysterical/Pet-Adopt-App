import {
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO, useClerk } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Lấy kích thước màn hình
  const { width, height } = useWindowDimensions();

  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const clerk = useClerk();
  const router = useRouter();

  // Hệ số để tính toán kích thước tương đối
  const scale = Math.min(width, height) / 375; // 375 là chiều rộng cơ sở (iPhone 8)

  // Hàm tính fontsize tương đối
  const normalize = (size) => {
    return Math.round(size * scale);
  };

  // Hàm để xóa cache token
  const clearCache = async () => {
    try {
      await SecureStore.deleteItemAsync("clerk-js-sdk");
      console.log("Đã xóa cache token Clerk");
    } catch (err) {
      console.error("Lỗi khi xóa cache:", err);
    }
  };

  const onPress = useCallback(async () => {
    try {
      // Xóa cache trước khi bắt đầu flow mới
      await clearCache();

      // Đảm bảo đóng bất kỳ phiên xác thực nào còn đang mở
      await WebBrowser.coolDownAsync();

      console.log("Bắt đầu quá trình đăng nhập Google...");
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "myapp",
          path: "/(tabs)/home",
        }),
      });

      console.log("Kết quả SSO flow:", { createdSessionId });

      // Hoàn thành quá trình đăng nhập nếu có session ID
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        console.log("Đăng nhập thành công!");
        router.replace("/(tabs)/home");
      } else {
        console.log("Không nhận được createdSessionId");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, router]);

  return (
    <View style={{ backgroundColor: Colors.WHITE, flex: 1 }}>
      <Image
        source={require("../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: height * 0.5, // 50% chiều cao màn hình
          resizeMode: "cover",
        }}
      />
      <View
        style={{
          padding: width * 0.05, // 5% chiều rộng màn hình
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between",
        }}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: normalize(20),
              fontFamily: "outfit-bold",
              textAlign: "center",
              marginBottom: height * 0.02,
            }}>
            Are you ready to find your new best friend?
          </Text>
          <Text
            style={{
              // fontWeight: "bold",
              fontSize: normalize(18),
              fontFamily: "outfit-bold",
              textAlign: "center",
              color: Colors.GRAY,
            }}>
            Let's get started by creating an account and finding your perfect
            pet!
          </Text>
        </View>

        <Pressable
          onPress={onPress}
          style={{
            padding: width * 0.035, // Tương đương ~14px trên iPhone 8
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 15,
            marginBottom: height * 0.05, // Margin bottom để tránh quá sát đáy màn hình
          }}>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: normalize(20),
              textAlign: "center",
            }}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
