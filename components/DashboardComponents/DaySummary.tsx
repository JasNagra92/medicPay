import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useUserInfo } from "../../context/userInfoContext";
import { format } from "date-fns";
import ToggleSwitch from "./ToggleSwitch";

interface IDaySummaryProps {
  DayOrNight: string;
  Date: Date;
  BaseHoursWorked: number;
  AlphaHoursWorked?: number;
  NightHoursWorked?: number;
  WeekendHoursWorked?: number;
  TotalForDay: string;
  baseRate: string;
  shiftStart: Date;
  shiftEnd: Date;
}

export default function DaySummary({
  DayOrNight,
  Date,
  BaseHoursWorked,
  NightHoursWorked,
  WeekendHoursWorked,
  TotalForDay,
  baseRate,
  shiftStart,
  shiftEnd,
}: IDaySummaryProps) {
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
      className="pt-3 flex flex-col rounded-2xl bg-white divide-y divide-gray-300 divide-opacity-25"
    >
      <View className="px-3 flex flex-col">
        <View className="flex-1/3 flex flex-row justify-between">
          <View className="flex flex-row">
            <View className="rounded-lg overflow-hidden mb-1">
              <Text className="bg-[#379D9F] flex flex-1/3 p-1.5 text-white font-bold">
                {DayOrNight}
              </Text>
            </View>
            <Text className=" p-1.5 font-bold">{`${format(
              shiftStart,
              "p"
            )} - ${format(shiftEnd, "p")}`}</Text>
          </View>
          <AntDesign name="up" size={18} color="black" style={{ padding: 7 }} />
        </View>
        <View className="flex-1/3 py-0.5 flex-row justify-between">
          <Text className="font-bold mt-2">{Date.toDateString()}</Text>
          <ToggleSwitch />
        </View>
      </View>

      <View className="flex flex-col py-1">
        <View className="flex flex-row px-3">
          <Text className="opacity-30 flex-1">Base Pay</Text>
          <Text className="flex-2">
            {BaseHoursWorked} Hrs x ${baseRate}
          </Text>
          <Text className="flex-1 text-right">
            {" "}
            ${(BaseHoursWorked * parseInt(baseRate)).toFixed(2)}
          </Text>
        </View>
        {userInfo?.shiftPattern === "Alpha" ? (
          <View className="flex flex-row px-3">
            <Text className="opacity-30 flex-1">Alpha P</Text>
            <Text className="flex-2">{NightHoursWorked} Hrs x $3.60</Text>
            <Text className="flex-1 text-right">
              {" "}
              ${(NightHoursWorked! * 3.6).toFixed(2)}
            </Text>
          </View>
        ) : null}
        <View className="flex flex-row px-3">
          <Text className="opacity-30 flex-1">Night P</Text>
          <Text className="flex-2">{NightHoursWorked} Hrs x $2.00</Text>
          <Text className="flex-1 text-right">
            {" "}
            ${(NightHoursWorked! * 2.0).toFixed(2)}
          </Text>
        </View>
        <View className="flex flex-row px-3">
          <Text className="opacity-30 flex-1">Weekend P</Text>
          <Text className="flex-2">{WeekendHoursWorked} Hrs x $2.50</Text>
          <Text className="flex-1 text-right">
            {" "}
            ${(WeekendHoursWorked! * 2.25).toFixed(2)}
          </Text>
        </View>
        <View className="flex flex-row justify-between rounded-xl py-2 px-1 mx-1 bg-[#e1f1f1] ">
          <Text className="opacity-30">Day Total:</Text>
          <Text className="font-bold">
            ${parseFloat(TotalForDay).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
