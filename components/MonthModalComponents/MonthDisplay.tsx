import React from "react";
import { router } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { calculateMonthlyTotalEarnings } from "../../utils/HourAndMoneyUtils";
import {
  useUserInfo,
  useUserInfoDispatch,
} from "../../context/userInfoContext";

interface IMonthDisplayProps {
  monthAndYear: string;
}

export default function MonthDisplay({ monthAndYear }: IMonthDisplayProps) {
  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();
  let monthlyEarnings = 0;
  if (userInfo) {
    monthlyEarnings = calculateMonthlyTotalEarnings(userInfo, monthAndYear);
  }

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
      }}
      className="rounded-2xl bg-white border-0 p-4 w-5/6"
      onPress={() => {
        if (dispatch) {
          dispatch({
            type: "setPayMonthAndYearToDisplay",
            payload: monthAndYear,
          });
          router.back();
        }
      }}
    >
      <Text className="text-center font-semibold">
        {monthAndYear} - ${monthlyEarnings.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}
