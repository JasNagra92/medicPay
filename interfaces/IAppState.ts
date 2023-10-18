export interface IUserInfo {
  hourlyWage: string;
  payDay: string | undefined;
  shiftPattern: string;
  rotation?: string;
  platoon: string;
  dayShiftStartTime: number;
  dayShiftEndTime: number;
  nightShiftStartTime: number;
  nightShiftEndTime: number;
}

export type Action =
  | { type: "setHourlyWage"; payload: string }
  | { type: "setPayday"; payload: string }
  | { type: "setShiftPattern"; payload: string }
  | { type: "setPlatoon"; payload: string }
  | { type: "setRotation"; payload: string };
