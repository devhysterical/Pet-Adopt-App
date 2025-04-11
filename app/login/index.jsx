import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback, useEffect } from "react";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "myapp",
            path: "/home",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}>
      <Image
        source={require("../../assets/images/login.jpg")}
        style={{
          width: "100%",
          height: 500,
          resizeMode: "cover",
        }}
      />
      <View
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}>
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
