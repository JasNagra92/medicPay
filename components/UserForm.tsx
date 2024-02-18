import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import { DateTime } from "luxon";
import getPayDaysFromServer from "../utils/helpers/serverCalls";
import { usePayPeriodDispatch } from "../context/payPeriodDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { monthNames } from "../utils/helpers/constants";

export default function UserForm({ isEditing }: { isEditing: boolean }) {
  const userInfo = useUserInfo();
  const userInfoDispatch = useUserInfoDispatch();
  const payPeriodDispatch = usePayPeriodDispatch();
  const dispatch = useUserInfoDispatch();
  const [hourlyWage, setHourlyWage] = useState(""); // State to hold hourly wage value
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      if (isEditing) {
        let response = await axiosInstance.post(
          "/getDeductions/resetDeductions",
          {
            userInfo: { ...userInfo, hourlyWage },
          }
        );
        console.log(response.data);

        // in this branch the user is editing their information through the profile page so when fetching data from the server, first check storage to see what that last pay period that was being rendered was, and fetch pay period data for the same pay period just with the updated user Info
        try {
          const value = await AsyncStorage.getItem("monthAndYear");
          if (value !== null && userInfoDispatch) {
            userInfoDispatch({
              type: "setPayMonthAndYearToDisplay",
              payload: value,
            });
            const requestedMonthName = value.split(" ")[0];
            const monthNumber = monthNames.indexOf(requestedMonthName!) + 1;
            const requestedYear = value.split(" ")[1];

            getPayDaysFromServer(
              { ...userInfo!, hourlyWage },
              monthNumber,
              parseInt(requestedYear!),
              payPeriodDispatch!
            );
          }
        } catch (e) {
          console.log("error reading month and year from storage");
        }
      } else {
        let resp = await axiosInstance.post("/users/saveUser", {
          user: { ...userInfo, hourlyWage },
        });

        let today = DateTime.now();
        getPayDaysFromServer(
          { ...userInfo!, hourlyWage },
          today.month,
          today.year,
          payPeriodDispatch!
        );
      }

      setLoading(false);

      router.push("/(app)/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <KeyboardAvoidingView
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
        className="rounded-2xl bg-white shadow-sm h-5/6 w-5/6 border-0 pb-3 flex flex-col"
        behavior={`${Platform.OS == "ios" ? "padding" : "height"}`}
      >
        <View
          style={{
            flexGrow: 1,
            justifyContent: "space-evenly",
          }}
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
            <Text className="font-bold text-white text-center">
              {loading ? <ActivityIndicator size={"small"} /> : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
