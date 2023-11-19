import {
  ISingleDaysPayData,
  IUserInfo,
  UserInfoAction,
} from "../interfaces/IAppState";

export default function userInfoReducer(
  draft: IUserInfo,
  action: UserInfoAction
) {
  switch (action.type) {
    case "setHourlyWage":
      draft.hourlyWage = action.payload;
      break;
    case "setPaydayToDisplay":
      draft.payDayToDisplay = action.payload;
      break;
    case "setPayMonthAndYearToDisplay":
      draft.payMonthAndYearToDisplay = action.payload;
      break;
    case "setShiftPattern":
      draft.shiftPattern = action.payload;
      break;
    case "setPlatoon":
      draft.platoon = action.payload;
      break;
    case "setRotation":
      draft.rotation = action.payload;
      break;
    case "setDayShiftStart":
      draft.dayShiftStartTime = {
        hours: action.payload.hours,
        minutes: action.payload.minutes,
      };
      break;
    case "setDayShiftEnd":
      draft.dayShiftEndTime = {
        hours: action.payload.hours,
        minutes: action.payload.minutes,
      };
      break;
    case "setNightShiftStart":
      draft.nightShiftStartTime = {
        hours: action.payload.hours,
        minutes: action.payload.minutes,
      };
      break;
    case "setNightShiftEnd":
      draft.nightShiftEndTime = {
        hours: action.payload.hours,
        minutes: action.payload.minutes,
      };
      break;
    default:
      return draft;
  }
}
