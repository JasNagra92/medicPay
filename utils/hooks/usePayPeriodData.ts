import { useState } from "react";
import { useImmer } from "use-immer";

export function usePayPeriodData() {
  const [payPeriodData, setPayPeriodData] = useImmer([]);

  return { payPeriodData, setPayPeriodData };
}
