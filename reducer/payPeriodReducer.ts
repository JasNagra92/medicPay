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
    default:
      return draft;
  }
}
