import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";

interface IDayOffProps {
  date: Date;
}

export default function DayOff({ date }: IDayOffProps) {
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
      className="flex flex-row rounded-2xl bg-white p-2"
    >
      <View className="flex flex-row justify-between flex-1">
        <View className="rounded-lg overflow-hidden mb-1 flex flex-row">
          <View className="rounded-lg overflow-hidden mb-1">
            <Text className="bg-[#379D9F] flex flex-1/3 p-1.5 text-white font-bold">
              Day Off
            </Text>
          </View>
          <Text className=" p-1.5 font-bold">{date.toString()}</Text>
        </View>
        <AntDesign name="down" size={18} color="black" style={{ padding: 7 }} />
      </View>
    </View>
  );
}
