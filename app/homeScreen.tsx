import { router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainPageInput from "../components/LoginSignUpInput";
import Toast from "react-native-toast-message";
import { useUserInfoDispatch } from "../context/userInfoContext";
import { Image } from "expo-image";
import { appSignUp } from "../store";
const image = require("../assets/images/bgImage.png");
const logo = require("../assets/images/logo.jpeg");

export default function Login() {
  const dispatchUserInfo = useUserInfoDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await appSignUp(email, password);

      if (dispatchUserInfo) {
        dispatchUserInfo({
          type: "setUserId",
          payload: userCredential.user?.uid!,
        });
        dispatchUserInfo({
          type: "setEmail",
          payload: userCredential.user?.email!,
        });
      }

      router.push("/workShift");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error.message}`,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <View
        style={{
          width: "50%",
          height: 175,
        }}
      >
        <Image
          source={logo}
          transition={1000}
          style={{ justifyContent: "center", flex: 1 }}
          contentFit="cover"
        />
      </View>
      <View className="flex flex-col items-center">
        <Text className="text-black text-5xl font-bold">MedicPay!</Text>
        <Text className="text-xl">Create an account to get started</Text>
      </View>
      <View className="rounded-2xl bg-white border-0 flex flex-col w-96 ">
        <MainPageInput
          icon="mail"
          placeholder="Email"
          handleChange={setEmail}
        />
        <MainPageInput
          icon="lock"
          placeholder="Password"
          handleChange={setPassword}
        />

        <View className="flex justify-center">
          <TouchableOpacity
            className="p-4 m-5 rounded-xl bg-[#96c560]"
            onPress={handleSignUp}
          >
            <Text className="text-center font-bold text-white text-lg">
              Sign up
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-black text-[16px]">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/loginScreen")}>
              <Text className="font-bold text-lg"> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
