import React, { ReactNode, createContext, useReducer, useContext } from "react";
import { UserInfoAction, IUserInfo } from "../interfaces/IAppState";
import userInfoReducer from "../reducer/userInfoReducer";
import { useImmerReducer } from "use-immer";

const initialUserInfo: IUserInfo = {
  email: "test@email.com",
  id: "user1-replace-with-uuid",
  hourlyWage: "",
  shiftPattern: "",
  platoon: "A",
  dayShiftStartTime: { hours: 0, minutes: 0 },
  dayShiftEndTime: { hours: 0, minutes: 0 },
  nightShiftStartTime: { hours: 0, minutes: 0 },
  nightShiftEndTime: { hours: 0, minutes: 0 },
  payMonthAndYearToDisplay: new Date(2024, 0, 1).toLocaleDateString("en-us", {
    month: "long",
    year: "numeric",
  }),
};

export const UserInfoContext = createContext<IUserInfo | null>(initialUserInfo);
export const UserInfoDisptachContext =
  createContext<React.Dispatch<UserInfoAction> | null>(null);

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const useUserInfoDispatch = () => {
  return useContext(UserInfoDisptachContext);
};

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const [userInfo, dispatch] = useImmerReducer(
    userInfoReducer,
    initialUserInfo
  );
  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoDisptachContext.Provider value={dispatch}>
        {children}
      </UserInfoDisptachContext.Provider>
    </UserInfoContext.Provider>
  );
}
