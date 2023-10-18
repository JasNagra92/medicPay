import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  useUserInfo,
  UserInfoDisptachContext,
  useUserInfoDispatch,
} from "../context/userInfoContext";

interface IUserButtonProps {
  text: string;
  button: { key1: string; key2: string };
  extraStyle?: string;
}

export default function UserButtonInput({
  text,
  button,
  extraStyle,
}: IUserButtonProps) {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();
  const buttonStyle = "px-4 border rounded-xl border-gray-300 p-2 mt-1";

  const handleChange = (pattern: string) => {
    if (dispatch) {
      dispatch({ type: "setShiftPattern", payload: pattern });
    }
  };

  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">{text}</Text>
      <View className="flex flex-row ml-3 ">
        <TouchableOpacity
          className={`${buttonStyle} ${extraStyle} mr-2 ${
            userInfo?.shiftPattern === "Alpha" ? "bg-[#379D9F]" : null
          }`}
          onPress={() => handleChange(button.key1)}
        >
          <Text
            className={`${
              userInfo?.shiftPattern === "Alpha" ? "text-white" : null
            }`}
          >
            {button.key1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${buttonStyle} ${extraStyle} ${
            userInfo?.shiftPattern === "Bravo/Charlie" ? "bg-[#379D9F]" : null
          }`}
          onPress={() => handleChange(button.key2)}
        >
          <Text
            className={`${
              userInfo?.shiftPattern === "Bravo/Charlie" ? "text-white" : null
            }`}
          >
            {button.key2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
