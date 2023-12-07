import { Link, Redirect } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import MainPageInput from "../components/MainPageInput";
const image = require("../assets/images/bgImage.png");
import { useAuthentication } from "../utils/hooks/useAuthentication";

export default function Login() {
  const { user } = useAuthentication();

  return (
    <ImageBackground source={image} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
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
            elevation: 10,
          }}
          className="rounded-2xl bg-white shadow-sm w-5/6 border-0 pt-3 pb-3 flex flex-col justify-center"
        >
          <MainPageInput icon="mail" placeholder="email" />
          <MainPageInput icon="lock" placeholder="password" />

          <View className="flex flex-row justify-center p-3">
            <Link href="/dashboard" asChild>
              <TouchableOpacity className="p-4 mx-3 rounded-xl flex-1 bg-[#c6e4e5]">
                <Text className="text-[#379D9F] text-center font-bold">
                  Login
                </Text>
              </TouchableOpacity>
            </Link>
            <Link href="/signUp" asChild>
              <TouchableOpacity className="p-4 mx-3 rounded-xl flex-1 bg-[#379D9F]">
                <Text className="text-white text-center font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
