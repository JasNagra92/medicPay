import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import { useState } from "react";
import MainPageInput from "../components/MainPageInput";
const image = require("../assets/images/bgImage.png");
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { signUp } from "../utils/hooks/useSignUp";
import { UserCredential } from "firebase/auth";
import { useUserInfoDispatch } from "../context/userInfoContext";
import { router } from "expo-router";

export default function HomePage() {
  const { user } = useAuthentication();
  const dispatchUserInfo = useUserInfoDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      let userCredential: UserCredential = await signUp(email, password);
      if (dispatchUserInfo) {
        dispatchUserInfo({
          type: "setUserId",
          payload: userCredential.user.uid,
        });
      }
      router.push("/workShift");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
      >
        <View
          style={{
            shadowColor: "rgba(0, 0, 0, 0.25)",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowRadius: 25,
            shadowOpacity: 1,
          }}
          className="rounded-2xl bg-white shadow-sm w-5/6 border-0 pt-3 pb-3 flex flex-col justify-center mt-10"
        >
          <MainPageInput
            icon="mail"
            placeholder="email"
            handleChange={setEmail}
          />
          <MainPageInput
            icon="lock"
            placeholder="password"
            handleChange={setPassword}
          />

          <View className="flex flex-row justify-center p-3">
            <TouchableOpacity className="p-4 mx-3 rounded-xl flex-1 bg-[#c6e4e5]">
              <Text className="text-[#379D9F] text-center font-bold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 mx-3 rounded-xl flex-1 bg-[#379D9F]"
              onPress={handleSignUp}
            >
              <Text className="text-white text-center font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
