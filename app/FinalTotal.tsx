import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ImageBackground, View, Text } from "react-native";

const image = require("../assets/images/bgImage.png");

export default function FinalTotal() {
  const test = [1, 2];
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
          }}
          className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 pt-3 pb-3 flex flex-col justify-around"
        >
          <View>
            <Text>Final Total</Text>
          </View>

          <View className="flex flex-col justify-evenly">
            {/* <TotalLine premiumType="Base Pay" />
            <TotalLine premiumType="Alpha P" />
            <TotalLine premiumType="Night Shift" />
            <TotalLine premiumType="Weekend" /> */}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
