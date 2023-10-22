import React, { useContext } from "react";
import { View, Text, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";

export default function UserInputField() {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const handleChange = (newValue: string) => {
    if (dispatch) {
      dispatch({ type: "setHourlyWage", payload: newValue });
    }
  };

  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">Hourly Wage</Text>
      <View className="border p-2.5 mx-3 mt-1 rounded-md border-gray-300 flex flex-row items-center">
        <TextInput
          placeholder="Enter Hourly Wage"
          placeholderTextColor={"#808080"}
          className="flex-1"
          value={userInfo?.hourlyWage}
          onChangeText={(text) => handleChange(text)}
        />
      </View>
    </View>
  );
}
