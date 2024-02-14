import React from "react";
import { View, Text, TextInput } from "react-native";

const UserInputField = ({ inputRef, hourlyWage, setHourlyWage }: any) => {
  const handleChange = (newValue: string) => {
    setHourlyWage(newValue);
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
