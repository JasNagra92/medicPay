export interface IUserInfo {
  hourlyWage: string;
  payDay: string | undefined;
  shiftPattern: string;
  platoon: string;
  dayShiftStartTime: number;
  dayShiftEndTime: number;
  nightShiftStartTime: number;
  nightShiftEndTime: number;
}

export interface ISetHourlyWageAction {
  type: string;
  payload: {
    hourlyWage: string;
  };
}

export type Action =
  | { type: "setHourlyWage"; payload: string }
  | { type: "setPayday"; payload: string }
  | { type: "setAnotherAction"; payload: boolean };
