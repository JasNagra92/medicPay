import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import ToggleSwitch from "./ToggleSwitch";
import { ISingleDaysPayDataWithIndex } from "./DaySummary";

export default function DayOff({
  date,
  rotation, //Day 1, Day 2, Night 1 //
  shiftStart,
  shiftEnd,
  baseHoursWorked,
  baseWageEarnings,
  nightHoursWorked,
  alphaNightsEarnings,
  nightEarnings,
  weekendHoursWorked,
  weekendEarnings,
  dayTotal,
  stiipHours,
  regOTHours,
  index,
  indexInMonth,
}: ISingleDaysPayDataWithIndex) {
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
      className="flex flex-row rounded-2xl bg-white p-2 justify-between"
    >
      <View className="rounded-lg overflow-hidden mb-2 flex flex-row">
        <View className="rounded-lg overflow-hidden">
          <Text className="bg-[#379D9F] p-1.5 text-white font-bold">
            Day Off
          </Text>
        </View>

        <Text className=" p-1.5 font-bold">
          {new Date(date).toDateString()}
        </Text>
      </View>

      <View>
        <ToggleSwitch
          date={new Date(date)}
          index={index}
          rotation={rotation}
          shiftStart={shiftStart}
          shiftEnd={shiftEnd}
          indexInMonth={indexInMonth}
        />
      </View>
    </View>
  );
}
