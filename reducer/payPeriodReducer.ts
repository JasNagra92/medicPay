import { IPayPeriodData, PayPeriodAction } from "../interfaces/IAppState";

export default function payPeriodDataReducer(
  draft: IPayPeriodData,
  action: PayPeriodAction
) {
  switch (action.type) {
    case "setPayPeriod":
      draft.payday = action.payload.payday;
      draft.workDaysInPayPeriod = action.payload.workDaysInPayPeriod;
      break;
    case "updateStiip":
      draft.workDaysInPayPeriod[action.payload.index] =
        action.payload.updatedSingleDay;
      break;
    default:
      return draft;
  }
}
