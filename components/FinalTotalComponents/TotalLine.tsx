import React from "react";
import { View, Text } from "react-native";

interface ITotalLineProps {
  premiumType: string;
  hoursTotal: number;
  premiumRate: string;
  premiumTotal: string;
  bgColor: number;
}

export default function TotalLine({
  premiumType,
  hoursTotal,
  premiumRate,
  premiumTotal,
  bgColor,
}: ITotalLineProps) {
  return (
    <View
      className={`flex flex-row p-4 ${
        bgColor % 2 === 0 ? "bg-slate-100" : null
      }`}
    >
      <Text className="flex-1">{premiumType}</Text>
      <Text className="flex-2 font-semibold">
        {hoursTotal} Hrs x ${premiumRate}
      </Text>

      <Text className="font-bold flex-1 text-right">${premiumTotal}</Text>
    </View>
  );
}
