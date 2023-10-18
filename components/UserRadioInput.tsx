import React, { useState } from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";

export default function UserRadioInput() {
  const [checked, setChecked] = useState("A");
  const color = "#379D9F";
  const platoons = ["A", "B", "C", "D"];
  return (
    <View className="flex flex-col ml-3">
      <Text className="font-bold">Select Platoon</Text>
      <View className="flex flex-row right-2">
        {platoons.map((platoon, i) => {
          return (
            <View key={i} className="flex flex-row items-center">
              <RadioButton.Android
                value={platoon}
                status={checked === `${platoon}` ? "checked" : "unchecked"}
                onPress={() => setChecked(platoon)}
                color={color}
                uncheckedColor="black"
              />
              <Text className="text-[#808080]">{platoon}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
