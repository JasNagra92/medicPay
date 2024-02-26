import React from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";

interface IUserRadioInputProps {
  label: string;
}

export default function UserRadioInput({ label }: IUserRadioInputProps) {
  const color = "#379D9F";
  let platoons;
  let rotation;

  label === "Select Platoon"
    ? (platoons = ["A", "B", "C", "D"])
    : (rotation = ["R1", "R2", "R3", "R4"]);

  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const handlePress = (data: string) => {
    if (dispatch) {
      // if data is a platoon then it is a single string so set platoon, otherwise it would be the rotation so set rotation
      data.length === 1
        ? dispatch({ type: "setPlatoon", payload: data })
        : dispatch({ type: "setRotation", payload: data });
    }
  };

  return (
    <View className="flex flex-col ml-3">
      <Text className="font-bold">Select Platoon</Text>
      <View className="flex flex-row right-2">
        {platoons &&
          platoons.map((platoon, i) => {
            return (
              <View key={i} className="flex flex-row items-center">
                <RadioButton.Android
                  value={platoon}
                  status={
                    userInfo?.platoon === `${platoon}` ? "checked" : "unchecked"
                  }
                  onPress={() => handlePress(platoon)}
                  color={color}
                  uncheckedColor="black"
                />
                <Text className="text-[#808080]">{platoon}</Text>
              </View>
            );
          })}
        {rotation &&
          rotation.map((r, i) => {
            return (
              <View key={i} className="flex flex-row items-center">
                <RadioButton.Android
                  value={r}
                  status={
                    userInfo?.rotation === `${r}` ? "checked" : "unchecked"
                  }
                  onPress={() => handlePress(r)}
                  color={color}
                  uncheckedColor="black"
                />
                <Text className="text-[#808080]">{r}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}
