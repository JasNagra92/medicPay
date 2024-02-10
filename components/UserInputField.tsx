import React, { useState, RefObject } from "react";
import { View, Text, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";

const UserInputField = ({ inputRef, hourlyWage, setHourlyWage }) => {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const handleChange = (newValue: string) => {
    setHourlyWage(newValue);
    // const numericInput = newValue.replace(/[^0-9.]/g, "");
    // if (dispatch) {
    //   dispatch({ type: "setHourlyWage", payload: numericInput });
    // }
  };

  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">Hourly Wage</Text>
      <View className="border p-2.5 mx-3 mt-1 rounded-md border-gray-300 flex flex-row items-center">
        <TextInput
          placeholder="Enter Hourly Wage"
          placeholderTextColor={"#808080"}
          className="flex-1"
          value={hourlyWage}
          onChangeText={(text) => handleChange(text)}
          keyboardType="numeric"
          inputMode="numeric"
          blurOnSubmit
          ref={inputRef}
        />
      </View>
    </View>
  );
};
export default UserInputField;
