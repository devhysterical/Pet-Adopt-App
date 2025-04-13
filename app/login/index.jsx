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
import { useSSO, useClerk, useAuth } from "@clerk/clerk-expo";
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
  const { isSignedIn, isLoaded } = useAuth(); // Thêm hook kiểm tra đăng nhập
  const router = useRouter();

  // Hệ số để tính toán kích thước tương đối
  const scale = Math.min(width, height) / 375; // 375 là chiều rộng cơ sở (iPhone 8)

  // Hàm tính fontsize tương đối
  const normalize = (size) => {
    return Math.round(size * scale);
  };

  const onPress = useCallback(async () => {
    try {
      // Kiểm tra nếu dữ liệu Clerk đã được tải xong
      if (!isLoaded) {
        console.log("Đang tải dữ liệu xác thực...");
        return;
      }

      // Kiểm tra nếu người dùng đã đăng nhập
      if (isSignedIn) {
        console.log("Người dùng đã đăng nhập, chuyển hướng đến home");
        router.replace("/(tabs)/home");
        return;
      }

      // Nếu chưa đăng nhập, tiến hành flow đăng nhập
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
  }, [startSSOFlow, router, isSignedIn, isLoaded]);

  return (
    <View style={{ backgroundColor: Colors.WHITE, flex: 1 }}>
      <Image
        source={require("../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: height * 0.5,
          resizeMode: "cover",
        }}
      />
      <View
        style={{
          padding: width * 0.05,
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
            padding: width * 0.035,
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 15,
            marginBottom: height * 0.05,
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
