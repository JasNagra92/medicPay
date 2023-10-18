import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface IUserButtonProps {
  text: string;
  button: { key1: string; key2: string };
  extraStyle?: string;
  handleChange: (pattern: string) => void;
  selected?: string;
}

export default function UserButtonInput({
  text,
  button,
  extraStyle,
  handleChange,
  selected,
}: IUserButtonProps) {
  const buttonStyle = "px-4 border rounded-xl border-gray-300 p-2 mt-1";
  return (
    <View className="flex flex-col">
      <Text className="ml-3 font-bold">{text}</Text>
      <View className="flex flex-row ml-3 ">
        <TouchableOpacity
          className={`${buttonStyle} ${extraStyle} mr-2 ${
            selected === "Alpha" ? "bg-[#379D9F]" : null
          }`}
          onPress={() => handleChange(button.key1)}
        >
          <Text className={`${selected === "Alpha" ? "text-white" : null}`}>
            {button.key1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${buttonStyle} ${extraStyle} ${
            selected === "Bravo/Charlie" ? "bg-[#379D9F]" : null
          }`}
          onPress={() => handleChange(button.key2)}
        >
          <Text
            className={`${selected === "Bravo/Charlie" ? "text-white" : null}`}
          >
            {button.key2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
