import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import UserInputField from "./UserInputField";
import UserButtonInput from "./UserButtonInput";
import UserRadioInput from "./UserRadioInput";
import UserShiftTimeInput from "./UserShiftTimeInput";
import { useUserInfo, useUserInfoDispatch } from "../context/userInfoContext";
import axiosInstance from "../utils/helpers/axiosInstance";
import {
  EmptyShiftPattern,
  EmptyShiftTimes,
  showErrorToast,
  showWageErrorToast,
} from "../utils/helpers/validation";
import DisclaimerModal from "./DisclaimerModal";

export default function UserForm() {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();
  const [hourlyWage, setHourlyWage] = useState(""); // State to hold hourly wage value
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const inputRef = useRef<TextInput>(null);

  const handlePressOutside = () => {
    // Blur the TextInput when tapping outside
    if (inputRef.current) {
      inputRef.current.blur();
    }
    // Dismiss the keyboard
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    if (/^(?:\d{1,3}(?:\.\d{0,2})?|\.\d{1,2})$/.test(hourlyWage)) {
      // Input matches the pattern, it's valid
      if (dispatch) {
        dispatch({ type: "setHourlyWage", payload: hourlyWage });
      }
    } else if (!hourlyWage) {
      showErrorToast("Hourly Wage");
      return;
    } else {
      // Input doesn't match the pattern, it's invalid
      // You can handle invalid input here, for example, show an error message
      showWageErrorToast();
      return;
      3;
    }
    if (EmptyShiftTimes(userInfo!)) {
      showErrorToast("Shift Times");
      return;
    }
    if (EmptyShiftPattern(userInfo!)) {
      {
        showErrorToast("Shift Pattern");
        return;
      }
    }
    if (userInfo?.shiftPattern === "Alpha" && !userInfo.rotation) {
      showErrorToast("Rotation");
      return;
    }
    try {
      let resp = await axiosInstance.post("/users/saveUser", {
        user: userInfo,
      });
      toggleModal();

      router.push("/(app)/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
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
        <UserInputField
          inputRef={inputRef}
          hourlyWage={hourlyWage}
          setHourlyWage={setHourlyWage}
        />
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
        <DisclaimerModal visible={modalVisible} onClose={toggleModal} />
      </View>
    </TouchableWithoutFeedback>
  );
}
