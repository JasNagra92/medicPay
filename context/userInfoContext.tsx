import React, { ReactNode, createContext, useReducer, useContext } from "react";
import { Action, IUserInfo } from "../interfaces/IAppState";
import userInfoReducer from "../reducer/userInfoReducer";

const initialUserInfo: IUserInfo = {
  hourlyWage: "",
  payDay: undefined,
  shiftPattern: "",
  platoon: "A",
  dayShiftStartTime: { hours: 0, minutes: 0 },
  dayShiftEndTime: { hours: 0, minutes: 0 },
  nightShiftStartTime: { hours: 0, minutes: 0 },
  nightShiftEndTime: { hours: 0, minutes: 0 },
};

export const UserInfoContext = createContext<IUserInfo | null>(initialUserInfo);
export const UserInfoDisptachContext =
  createContext<React.Dispatch<Action> | null>(null);

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const useUserInfoDispatch = () => {
  return useContext(UserInfoDisptachContext);
};

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const [userInfo, dispatch] = useReducer(userInfoReducer, initialUserInfo);
  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoDisptachContext.Provider value={dispatch}>
        {children}
      </UserInfoDisptachContext.Provider>
    </UserInfoContext.Provider>
  );
}
