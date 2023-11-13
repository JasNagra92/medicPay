import { Link, Redirect } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import MainPageInput from "../../components/MainPageInput";
const image = require("../../assets/images/bgImage.png");
import { useAuthentication } from "../../utils/hooks/useAuthentication";

export default function HomePage() {
  const { user } = useAuthentication();
  if (!user) {
    Redirect({ href: "/workShift" });
  }
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
          <MainPageInput icon="mail" placeholder="email" />
          <MainPageInput icon="lock" placeholder="password" />

          <Link href="/dashboard" asChild>
            <TouchableOpacity>
              <Text>Press me</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
