import React from "react";
import { View, Text } from "react-native";

interface ITotalLineProps {
  premiumType: string;
  hoursTotal: number;
  premiumRate: number;
  premiumTotal: number;
}

export default function TotalLine({
  premiumType,
  hoursTotal,
  premiumRate,
  premiumTotal,
}: ITotalLineProps) {
  return (
    <View className="flex flex-row justify-between">
      <Text>{premiumType}</Text>
      <Text>
        {hoursTotal} x ${premiumRate}
      </Text>
      <Text className="font-bold">{premiumTotal}</Text>
    </View>
  );
}
