import { View } from "react-native";
import { usePayPeriod } from "../../context/payPeriodDataContext";
import DeductionsLine from "../../components/FinalTotalComponents/DeductionsLine";
import { useLocalSearchParams } from "expo-router";

export default function DeductionsModal() {
  const payPeriod = usePayPeriod();
  const { indexInMonth } = useLocalSearchParams();
  let deductions = [];

  const { cpp, incomeTax, pserp, unionDues, ei } =
    payPeriod![parseInt(indexInMonth as string)];

  // Push deduction values into the deductions array
  deductions.push({ deductionType: "CPP", deductionTotal: cpp.toFixed(2) });
  deductions.push({
    deductionType: "Income Tax",
    deductionTotal: incomeTax.toFixed(2),
  });
  deductions.push({ deductionType: "PSERP", deductionTotal: pserp.toFixed(2) });
  deductions.push({
    deductionType: "Union Dues",
    deductionTotal: unionDues.toFixed(2),
  });
  deductions.push({ deductionType: "EI", deductionTotal: ei.toFixed(2) });
  deductions.push({
    deductionType: "Total Deductions",
    deductionTotal: cpp + incomeTax + pserp + unionDues + ei,
  });
  return (
    <View className="p-4 divide-y divide-solid">
      {deductions.map(({ deductionType, deductionTotal }, index) => (
        <DeductionsLine
          deductionType={deductionType}
          deductionTotal={deductionTotal.toString()} // Convert number to string if needed
          index={index}
          key={index}
        />
      ))}
    </View>
  );
}
