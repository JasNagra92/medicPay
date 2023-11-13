import { IPayPeriodData, PayPeriodAction } from "../interfaces/IAppState";

export default function payPeriodDataReducer(
  draft: IPayPeriodData,
  action: PayPeriodAction
) {
  switch (action.type) {
    case "setPayPeriod":
      draft.payDay = action.payload.payDay;
      draft.workDaysInPayPeriod = action.payload.workDaysInPayPeriod;
      break;
    case "updateSingleDay":
      draft.workDaysInPayPeriod[action.payload.index] =
        action.payload.updatedSingleDay;
      break;
    default:
      return draft;
  }
}
