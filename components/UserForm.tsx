import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import UserInputField from "./UserInputField";
import UserButtonInput from "./UserButtonInput";
import UserRadioInput from "./UserRadioInput";
import UserShiftTimeInput from "./UserShiftTimeInput";

export default function UserForm() {
  const [shiftPattern, setShiftPattern] = useState("");
  function handleShiftPattern(pattern: string) {
    setShiftPattern(pattern);
  }
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
      className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 pt-3 pb-3 flex flex-col justify-around"
    >
      <UserInputField
        text={"Hourly Wage"}
        placeholderText={"Enter Hourly Wage"}
      />
      <UserInputField
        text={"Payday"}
        placeholderText={"MM/DD/YYY"}
        icon={true}
      />
      <UserButtonInput
        text="Shift Pattern"
        button={{ key1: "Alpha", key2: "Bravo/Charlie" }}
        extraStyle="px-4"
        handleChange={handleShiftPattern}
        selected={shiftPattern}
      />
      <UserRadioInput />
      <UserButtonInput
        text="If Alpha, R day this period"
        button={{ key1: "Yes", key2: "No" }}
        extraStyle="px-5"
        handleChange={handleShiftPattern}
      />
      <UserShiftTimeInput text={"Day"} />
      <UserShiftTimeInput text={"Night"} />
      <Button
        mode="contained"
        buttonColor="#379D9F"
        className="mx-3 rounded-lg"
      >
        Submit
      </Button>
    </View>
  );
}
