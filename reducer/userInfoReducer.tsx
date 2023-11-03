import { useState } from "react";
import { IUserInfo } from "../interfaces/IAppState";
import { Action } from "../interfaces/IAppState";

export default function userInfoReducer(state: IUserInfo, action: Action) {
  switch (action.type) {
    case "setHourlyWage": {
      return { ...state, hourlyWage: action.payload };
    }
    case "setPayday": {
      return { ...state, payDay: action.payload };
    }
    case "setShiftPattern": {
      return { ...state, shiftPattern: action.payload };
    }
    case "setPlatoon": {
      return { ...state, platoon: action.payload };
    }
    case "setRotation": {
      return { ...state, rotation: action.payload };
    }
    case "setDayShiftStart": {
      return {
        ...state,
        dayShiftStartTime: {
          hours: action.payload.hours,
          minutes: action.payload.minutes,
        },
      };
    }
    case "setDayShiftEnd": {
      return {
        ...state,
        dayShiftEndTime: {
          hours: action.payload.hours,
          minutes: action.payload.minutes,
        },
      };
    }
    case "setNightShiftStart": {
      return {
        ...state,
        nightShiftStartTime: {
          hours: action.payload.hours,
          minutes: action.payload.minutes,
        },
      };
    }
    case "setNightShiftEnd": {
      return {
        ...state,
        nightShiftEndTime: {
          hours: action.payload.hours,
          minutes: action.payload.minutes,
        },
      };
    }
    case "UPDATE_PAY_PERIODS":
      return {
        ...state,
        payDayPeriods: {
          ...state.payDayPeriods,
          [action.payload.payDay.toString()]: action.payload.payPeriodSchedule,
        },
      };

    default:
      return state;
  }
}
