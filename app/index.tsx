import React, { useState, useEffect, useCallback } from "react";
import UserForm from "../components/UserForm";
import { StatusBar } from "expo-status-bar";
import { Text, ImageBackground, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { OpenSans_800ExtraBold, useFonts } from "@expo-google-fonts/open-sans";
import { PaperProvider } from "react-native-paper";
import { UserInfoProvider } from "../context/userInfoContext";
import { en, registerTranslation } from "react-native-paper-dates";
registerTranslation("en", en);

const image = require("../assets/images/bgImage.png");

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    OpenSans_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ImageBackground source={image} style={{ flex: 1 }}>
          <SafeAreaView
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              rowGap: 30,
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans_800ExtraBold",
                fontSize: 30,
                color: "white",
                textAlign: "center",
              }}
            >
              Work Shift
            </Text>
            <UserForm />
            <StatusBar style="auto" />
          </SafeAreaView>
        </ImageBackground>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
