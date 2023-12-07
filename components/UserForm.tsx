import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import UserInputField from "./UserInputField";
import UserButtonInput from "./UserButtonInput";
import UserRadioInput from "./UserRadioInput";
import UserShiftTimeInput from "./UserShiftTimeInput";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import axiosInstance from "../utils/helpers/axiosInstance";

export default function UserForm() {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const handleSubmit = async () => {
    try {
      let resp = await axiosInstance.post("/users/saveUser", {
        user: userInfo,
      });
      console.log(resp.data);
      router.push("/(app)/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
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
        elevation: 10,
      }}
      className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 pt-3 pb-3 flex flex-col justify-around"
    >
      <UserInputField />
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

      <TouchableOpacity
        className="mx-3 rounded-lg bg-[#379D9F] p-3"
        onPress={handleSubmit}
      >
        <Text className="font-bold text-white text-center">Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
