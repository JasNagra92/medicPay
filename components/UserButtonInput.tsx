import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function UserButtonInput() {
  const buttonStyle = "px-4 border rounded-xl opacity-40 p-2 mt-1";
  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">Shift Pattern</Text>
      <View className="flex flex-row ml-4 ">
        <TouchableOpacity className={`${buttonStyle} mr-2`}>
          <Text>Alpha</Text>
        </TouchableOpacity>
        <TouchableOpacity className={buttonStyle}>
          <Text>Bravo/Charlie</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
