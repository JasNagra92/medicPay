import React, { Dispatch, SetStateAction } from "react";
import { View, TextInput, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function MainPageInput({
  icon,
  placeholder,
  handleChange,
}: {
  icon: string;
  placeholder: string;
  handleChange: Dispatch<SetStateAction<string>>;
}) {
  const capitalizedPlaceholder =
    placeholder.charAt(0).toUpperCase() + placeholder.slice(1);

  return (
    <View>
      <Text className=" font-bold pl-5 pb-2 text-lg">
        {capitalizedPlaceholder}
      </Text>
      <View className="flex flex-row" style={{ alignItems: "center" }}>
        <MaterialIcons
          style={{ position: "absolute", left: 25 }}
          name={icon as any}
          size={24}
          color="black"
        />
        <TextInput
          className="flex-1 border rounded mx-5 py-2 pl-9 text-gray-700   focus:border-dotted focus:border-blue-500"
          placeholder={placeholder}
          onChangeText={handleChange}
        />
      </View>
    </View>
  );
}
