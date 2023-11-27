import React, { ReactNode, createContext, useContext } from "react";
import { IPayPeriodData, PayPeriodAction } from "../interfaces/IAppState";
import { useImmerReducer } from "use-immer";
import { DateTime } from "luxon";
import payPeriodDataReducer from "../reducer/payPeriodReducer";

const initialPayPeriodData: IPayPeriodData[] = [
  {
    payDay: DateTime.now().toString(),
    workDaysInPayPeriod: [],
    ei: 0,
    cpp: 0,
    incomeTax: 0,
    unionDues: 0,
    netIncome: 0,
    pserp: 0,
  },
];

export const PayPeriodContext = createContext<IPayPeriodData[] | null>(
  initialPayPeriodData
);
export const PayPeriodDispatchContext =
  createContext<React.Dispatch<PayPeriodAction> | null>(null);

export const usePayPeriod = () => {
  return useContext(PayPeriodContext);
};
export const usePayPeriodDispatch = () => {
  return useContext(PayPeriodDispatchContext);
};

export function PayPeriodProvider({ children }: { children: ReactNode }) {
  const [payPeriodData, dispatch] = useImmerReducer(
    payPeriodDataReducer,
    initialPayPeriodData
  );

  return (
    <PayPeriodContext.Provider value={payPeriodData}>
      <PayPeriodDispatchContext.Provider value={dispatch}>
        {children}
      </PayPeriodDispatchContext.Provider>
    </PayPeriodContext.Provider>
  );
}
