import { IUserInfo } from "../../interfaces/IAppState";
import Toast from "react-native-toast-message";

export const showErrorToast = (error: string) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: `${error} cannot be empty`,
    visibilityTime: 3000,
  });
};
export const showWageErrorToast = () => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: `Hourly Wage format must be XX.XX`,
    visibilityTime: 3000,
  });
};

// function to validate that the user filled in all the required fields on the main workshift page
export function EmptyShiftTimes(userInfo: IUserInfo) {
  if (
    userInfo.dayShiftStartTime.hours === 0 ||
    userInfo.dayShiftEndTime.hours === 0 ||
    userInfo.nightShiftStartTime.hours === 0
  ) {
    return true;
  } else {
    return false;
  }
}

export function EmptyShiftPattern(userInfo: IUserInfo) {
  return !userInfo.shiftPattern ? true : false;
}
