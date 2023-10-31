import React from "react";
import { View, Text, ScrollView } from "react-native";
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
    <View className="flex flex-col rounded-lg bg-white shadow-lg divide-y-2">
      <View className="flex flex-col">
        <View className="flex-1/3 flex flex-row justify-between">
          <View className="rounded-lg overflow-hidden m-2 mb-1">
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
        <View className="flex-1/3 p-1 ml-1">
          <Text className="font-bold">{Date.toDateString()}</Text>
        </View>
        <View className="flex-1/3 flex flex-row">
          <Button mode="contained"> STIIP</Button>
          <Button mode="contained"> OverTime </Button>
        </View>
      </View>

      <View>
        <View>
          <Text>Base</Text>
        </View>
        <View>
          <Text>Base</Text>
        </View>
        <View>
          <Text>Base</Text>
        </View>
        <View>
          <Text>Base</Text>
        </View>
        <View>
          <Text>Base</Text>
        </View>
      </View>
    </View>
  );
}
