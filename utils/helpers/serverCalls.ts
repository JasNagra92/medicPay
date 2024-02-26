import { IPayPeriodData, IUserInfo } from "../../interfaces/IAppState";
import axiosInstance from "./axiosInstance";
import { DateTime } from "luxon";

export default async function getPayDaysFromServer(
  userInfo: IUserInfo,
  month: number,
  year: number,
  payPeriodDispatch: Function // Add payPeriodDispatch as a parameter
) {
  try {
    // get the paydays for the current month and year and set them in state for the buttons to display correctly
    let response = await axiosInstance.post("/getPayData", {
      userInfo,
      month,
      year,
    });
    if (payPeriodDispatch) {
      payPeriodDispatch({
        type: "setPayPeriod",
        payload: response.data.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const getDeductionsFromServer = async (
  gross: number,
  incomeLessLevelling: number,
  stiipHours: number,
  OTOnePointFive: number,
  OTDoubleTime: number,
  OTStatReg: number,
  OTSuperStat: number,
  userInfo: IUserInfo,
  payPeriod: IPayPeriodData[],
  indexInMonth: number,
  payPeriodDispatch: Function
) => {
  try {
    console.log("i was called");
    let response = await axiosInstance.post("/getDeductions", {
      userInfo,
      grossIncome: gross,
      stiipHours,
      incomeLessLevelling,
      OTOnePointFiveAmount:
        OTOnePointFive * (parseFloat(userInfo?.hourlyWage!) * 1.5),
      OTDoubleTimeAmount:
        OTDoubleTime * (parseFloat(userInfo?.hourlyWage!) * 2.0),
      payDay: DateTime.fromISO(
        payPeriod![indexInMonth as any].payDay
      ).toISODate(),
      OTStatReg,
      OTSuperStat,
    });
    const { ei, incomeTax, cpp, pserp, unionDues, netIncome } =
      response.data.data;

    if (payPeriodDispatch) {
      payPeriodDispatch({
        type: "updateDeductions",
        payload: {
          indexInMonth,
          ei,
          incomeTax,
          cpp,
          pserp,
          unionDues,
          netIncome,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
