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
    default:
      return state;
  }
}
