import React from "react";
import { router } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import {
  useUserInfo,
  useUserInfoDispatch,
} from "../../context/userInfoContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IMonthDisplayProps {
  monthAndYear: string;
}

export default function MonthDisplay({ monthAndYear }: IMonthDisplayProps) {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();

  const storeMonthAndYearData = async (value: string) => {
    try {
      await AsyncStorage.setItem("monthAndYear", value);
    } catch (e) {
      console.log("error storing month and year in storage");
    }
  };
  return (
    <TouchableOpacity
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
      className="rounded-2xl bg-white border-0 p-4 w-5/6"
      onPress={() => {
        if (dispatch) {
          dispatch({
            type: "setPayMonthAndYearToDisplay",
            payload: monthAndYear,
          });
          storeMonthAndYearData(monthAndYear);
          router.back();
        }
      }}
    >
      <Text className="text-center font-semibold">{monthAndYear}</Text>
    </TouchableOpacity>
  );
}
