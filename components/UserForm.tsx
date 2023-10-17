import React from "react";
import { View } from "react-native";
import UserInputField from "./UserInputField";
import UserButtonInput from "./UserButtonInput";

export default function UserForm() {
  return (
    <View
      style={{
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowRadius: 25,
        shadowOpacity: 1,
      }}
      className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 pt-4 flex flex-col justify-around"
    >
      <UserInputField
        text={"Hourly Wage"}
        placeholderText={"Enter Hourly Wage"}
      />
      <UserInputField text={"Pay Period Start"} placeholderText={"MM/DD/YYY"} />
      <UserButtonInput />
    </View>
  );
}
