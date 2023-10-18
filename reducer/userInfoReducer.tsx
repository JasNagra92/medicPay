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
    default:
      return state;
  }
}
