import React from "react";
import { View, Text, TextInput } from "react-native";

interface IUserInputFieldProps {
  text: string;
  placeholderText: string;
}

export default function UserInputField({
  text,
  placeholderText,
}: IUserInputFieldProps) {
  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">{text}</Text>
      <TextInput
        placeholder={placeholderText}
        placeholderTextColor={"#808080"}
        className="border p-2.5 mx-3 mt-1 rounded-md opacity-40"
      ></TextInput>
    </View>
  );
}
