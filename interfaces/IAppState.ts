export interface IUserInfo {
  hourlyWage: string;
  payDay: Date | undefined;
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
  | { type: "setPayday"; payload: Date }
  | { type: "setShiftPattern"; payload: string }
  | { type: "setPlatoon"; payload: string }
  | { type: "setRotation"; payload: string };
