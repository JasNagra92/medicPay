import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import UserInputField from "./UserInputField";
import UserButtonInput from "./UserButtonInput";
import UserRadioInput from "./UserRadioInput";
import UserShiftTimeInput from "./UserShiftTimeInput";
import { useUserInfo } from "../context/userInfoContext";
import UserPaydayInput from "./UserPaydayInput";

export default function UserForm() {
  const userInfo = useUserInfo();
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
      <UserPaydayInput />
      <UserButtonInput
        text="Shift Pattern"
        button={{ key1: "Alpha", key2: "Bravo/Charlie" }}
        extraStyle="px-4"
      />
      <UserRadioInput label={"Select Platoon"} />
      {userInfo?.shiftPattern === "Alpha" ? (
        <UserRadioInput label={"Select Rotation"} />
      ) : null}
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
