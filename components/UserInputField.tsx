import React from "react";
import { View, Text, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";

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
  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">{text}</Text>
      <View className="border p-2.5 mx-3 mt-1 rounded-md opacity-30 border-gray-500 flex flex-row items-center">
        <TextInput
          placeholder={placeholderText}
          placeholderTextColor={"#808080"}
          className="flex-1"
        />
        {icon ? <AntDesign name="calendar" size={20} color="gray" /> : null}
      </View>
    </View>
  );
}
