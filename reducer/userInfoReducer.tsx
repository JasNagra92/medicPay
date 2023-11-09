import { ISingleDaysPayData, IUserInfo } from "../interfaces/IAppState";
import { Action } from "../interfaces/IAppState";

export default function userInfoReducer(draft: IUserInfo, action: Action) {
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
    case "SET_PAY_DAYS_FOR_YEAR":
      draft.payDaysForYear = action.payload;
      break;
    case "setUsedStiip":
      if (
        draft.payDaysForYear &&
        action.payload.payDayOnDisplay &&
        draft.payDaysForYear[action.payload.payDayOnDisplay]
      ) {
        const dayToUpdate = draft.payDaysForYear[
          action.payload.payDayOnDisplay
        ].payDaysInPayPeriod.find(
          (day) => day.day.toISOString() === action.payload.workDayToUpdate
        );
        if (dayToUpdate) {
          dayToUpdate.usedStiip = action.payload.usedStiip;
          dayToUpdate.stiipHours = action.payload.stiipHours;
          dayToUpdate.baseHoursWorked = 0;
          dayToUpdate.baseTotal = 0;
          dayToUpdate.nightHoursWorked = 0;
          dayToUpdate.nightTotal = 0;
          dayToUpdate.weekendHoursWorked = 0;
          dayToUpdate.weekendTotal = 0;
          dayToUpdate.alphaHoursWorked = 0;
          dayToUpdate.alphaTotal = 0;
          dayToUpdate.dayTotal =
            parseInt(action.payload.hourlyWage) *
            0.75 *
            action.payload.stiipHours;
        }
      }
      break;
    default:
      return draft;
  }
}
