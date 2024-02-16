import React, { useEffect } from "react";
import UserForm from "../../components/UserForm";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import { useLocalSearchParams } from "expo-router";
registerTranslation("en", en);

const image = require("../../assets/images/bgImage.png");

export default function WorkShift() {
  const { isEditing } = useLocalSearchParams();
  const isEditingBoolean =
    typeof isEditing === "string" ? isEditing === "true" : !!isEditing;
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ImageBackground source={image} style={{ flex: 1 }}>
          <SafeAreaView
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserForm isEditing={isEditingBoolean} />
            <StatusBar style="auto" />
          </SafeAreaView>
        </ImageBackground>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
