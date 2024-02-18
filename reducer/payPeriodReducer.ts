import { IPayPeriodData, PayPeriodAction } from "../interfaces/IAppState";

export default function payPeriodDataReducer(
  draft: IPayPeriodData[],
  action: PayPeriodAction
) {
  switch (action.type) {
    case "setPayPeriod":
      draft.splice(0, draft.length, ...action.payload);
      break;
    case "updateSingleDay":
      draft[action.payload.indexInMonth].workDaysInPayPeriod[
        action.payload.indexInWorkDays
      ] = action.payload.updatedSingleDay;
      break;
    case "addHolidayBlock":
      for (const [index, day] of action.payload.vacationDates.entries()) {
        draft[action.payload.indexInMonth].workDaysInPayPeriod[
          action.payload.index + index
        ] = day;
      }
      break;
    case "updateHolidayBlock":
      // check if the day 1 the user used to toggle the vacation block is less than 4 days away from the end of the payPeriod it was selected in, which means all 4 days can be updated in the same 2 week pay period, if it is less than 10, then all 4 updated vacation days can go in the same pay period
      let { indexInWorkDays, indexInMonth, updatedDays } = action.payload;

      if (updatedDays.length === 4) {
        for (let i = 0; i < 4; i++) {
          draft[indexInMonth].workDaysInPayPeriod[indexInWorkDays + i] =
            updatedDays[i];
        }
      }
      // this case handles updating vacation blocks that stretch 2 pay periods but are within the same current month, so index in month needs to be incremented
      if (updatedDays.length < 4) {
        for (let i = 0; i < updatedDays.length; i++) {
          draft[indexInMonth].workDaysInPayPeriod[indexInWorkDays + i] =
            updatedDays[i];
        }
      }
      break;
    case "updateDeductions":
      draft[action.payload.indexInMonth].ei = action.payload.ei;
      draft[action.payload.indexInMonth].cpp = action.payload.cpp;
      draft[action.payload.indexInMonth].incomeTax = action.payload.incomeTax;
      draft[action.payload.indexInMonth].netIncome = action.payload.netIncome;
      draft[action.payload.indexInMonth].pserp = action.payload.pserp;
      draft[action.payload.indexInMonth].unionDues = action.payload.unionDues;
      break;
    default:
      return draft;
  }
}
