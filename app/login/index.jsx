import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback, useEffect } from "react";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO, useClerk } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

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
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const clerk = useClerk();

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
      } else {
        console.log("Không nhận được createdSessionId");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

  return (
    <View style={{ backgroundColor: Colors.WHITE, height: "100%" }}>
      {/* Phần code giao diện giữ nguyên */}
      <Image
        source={require("../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: 500,
          resizeMode: "cover",
        }}
      />
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "outfit-bold",
            textAlign: "center",
          }}>
          Are you ready to find your new best friend?{"\n"}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            fontFamily: "outfit",
            textAlign: "center",
            color: Colors.GRAY,
          }}>
          Let's get started by creating an account and finding your perfect pet!
          {"\n"}
        </Text>
        <Pressable
          onPress={onPress}
          style={{
            padding: 14,
            marginTop: 100,
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 15,
          }}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 20,
              textAlign: "center",
            }}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
