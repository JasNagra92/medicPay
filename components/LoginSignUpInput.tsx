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
  return (
    <View className="mb-3">
      <Text className=" font-bold pl-5 pb-2 text-lg">{placeholder} *</Text>
      <View className="flex flex-row" style={{ alignItems: "center" }}>
        <MaterialIcons
          style={{ position: "absolute", right: 35 }}
          name={icon as any}
          size={24}
          color={"black"}
        />
        <TextInput
          className="flex-1 border rounded mx-5 p-4 pl-3 text-gray-700   focus:border-dotted focus:border-blue-500"
          placeholder={
            placeholder === "Email" ? `Enter your ${placeholder}` : "*****"
          }
          onChangeText={handleChange}
          secureTextEntry={placeholder === "Password" ? true : false}
        />
      </View>
    </View>
  );
}
