import React from "react";
import { View, Text } from "react-native";

interface IDeductionLineProps {
  deductionType: string;
  deductionTotal: string;
  index: number;
}

// Assuming deductionTotal is a string representation of a number
export default function DeductionsLine({
  deductionType,
  deductionTotal,
  index,
}: IDeductionLineProps & { index: number }) {
  return (
    <View
      className={`flex flex-row p-2 border-b-2 ${
        index % 2 === 0 ? "bg-slate-100" : ""
      }`}
    >
      <Text
        className={`flex-1 ${
          deductionType === "Total Deductions" ? "font-extrabold" : null
        } `}
      >
        {deductionType}
      </Text>
      {/* Parse deductionTotal to float and use toFixed method */}
      <Text
        className={`flex-1 font-bold text-right ${
          deductionType === "Total Deductions" ? "font-extrabold" : null
        } `}
      >
        ${parseFloat(deductionTotal).toFixed(2)}
      </Text>
    </View>
  );
}
