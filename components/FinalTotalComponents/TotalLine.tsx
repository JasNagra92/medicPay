import React from "react";
import { View, Text } from "react-native";

interface ITotalLineProps {
  premiumType: string;
  hoursTotal: number;
  premiumRate: string;
  premiumTotal: string;
  bgColor?: string;
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
      className={`flex flex-row justify-between p-4 ${
        bgColor ? "bg-slate-100" : null
      }`}
    >
      <Text>{premiumType}</Text>
      <Text>
        {hoursTotal}Hrs x ${premiumRate}
      </Text>
      <Text className="font-bold">${premiumTotal}</Text>
    </View>
  );
}
