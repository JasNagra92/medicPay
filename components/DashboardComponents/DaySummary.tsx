import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

interface IDaySummaryProps {
  DayOrNight: string;
  Date: Date;
  BaseHoursWorked: number;
  AlphaHoursWorked?: number;
  NightHoursWorked?: number;
  WeekendHoursWorked?: number;
  TotalForDay: string;
}

export default function DaySummary({
  DayOrNight,
  Date,
  BaseHoursWorked,
  AlphaHoursWorked,
  NightHoursWorked,
  WeekendHoursWorked,
  TotalForDay,
}: IDaySummaryProps) {
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
      className="p-3 flex flex-col rounded-2xl bg-white divide-y divide-gray-300 divide-opacity-25 "
    >
      <View className="flex flex-col">
        <View className="flex-1/3 flex flex-row justify-between">
          <View className="rounded-lg overflow-hidden mb-1">
            <Text className="bg-[#379D9F] flex flex-1/3 p-1.5 text-white font-bold">
              {`${DayOrNight}` + " Shift"}
            </Text>
          </View>
          <AntDesign
            name="down"
            size={18}
            color="black"
            style={{ padding: 7 }}
          />
        </View>
        <View className="flex-1/3 py-0.5">
          <Text className="font-bold">{Date.toDateString()}</Text>
        </View>
        <View className="flex-1/3 flex flex-row mb-1">
          <TouchableOpacity className="border border-black rounded-md p-1 mr-3 my-1 w-12">
            <Text className="text-center">Stiip</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-black rounded-md p-1 my-1 w-12">
            <Text className="text-center">OT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex flex-col py-1">
        <View className="flex flex-row ">
          <Text className="opacity-30 flex-1">Base</Text>
          <Text className="flex-2">12 Hrs x $43.43</Text>
          <Text className="flex-1 text-right"> = 430.43</Text>
        </View>
        <View className="flex flex-row">
          <Text className="opacity-30 flex-1">Alpha P</Text>
          <Text className="flex-2">12 Hrs x $43.43</Text>
          <Text className="flex-1 text-right"> = 430.43</Text>
        </View>
        <View className="flex flex-row">
          <Text className="opacity-30 flex-1">Night P</Text>
          <Text className="flex-2">12 Hrs x $43.43</Text>
          <Text className="flex-1 text-right"> = 430.43</Text>
        </View>
        <View className="flex flex-row">
          <Text className="opacity-30 flex-1">Weekend P</Text>
          <Text className="flex-2">12 Hrs x $43.43</Text>
          <Text className="flex-1 text-right"> = 430.43</Text>
        </View>
        <View className="flex flex-row justify-between rounded-lg py-2 px-1 bg-[#e1f1f1]">
          <Text className="opacity-30">Day Total:</Text>
          <Text className="font-bold">$890.34</Text>
        </View>
      </View>
    </View>
  );
}
