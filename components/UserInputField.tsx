import React, { useContext } from "react";
import { View, Text, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";

interface IUserInputFieldProps {
  text: string;
  placeholderText: string;
  icon?: boolean;
}

export default function UserInputField({
  text,
  placeholderText,
  icon,
}: IUserInputFieldProps) {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const handleChange = (newValue: string) => {
    if (dispatch && text === "Hourly Wage") {
      dispatch({ type: "setHourlyWage", payload: newValue });
    } else if (dispatch && text === "Payday") {
      dispatch({ type: "setPayday", payload: newValue });
    }
  };

  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">{text}</Text>
      <View className="border p-2.5 mx-3 mt-1 rounded-md opacity-30 border-gray-500 flex flex-row items-center">
        <TextInput
          placeholder={placeholderText}
          placeholderTextColor={"#808080"}
          className="flex-1"
          value={
            text === "Hourly Wage" ? userInfo?.hourlyWage : userInfo?.payDay
          }
          onChangeText={(text) => handleChange(text)}
        />
        {icon ? <AntDesign name="calendar" size={20} color="gray" /> : null}
      </View>
    </View>
  );
}
