export interface IShiftTime {
  hours: number;
  minutes: number;
}

export interface IUserInfo {
  hourlyWage: string;
  payDay: Date | undefined;
  shiftPattern: string;
  rotation?: string;
  platoon: string;
  dayShiftStartTime: IShiftTime;
  dayShiftEndTime: IShiftTime;
  nightShiftStartTime: IShiftTime;
  nightShiftEndTime: IShiftTime;
}

export type Action =
  | { type: "setHourlyWage"; payload: string }
  | { type: "setPayday"; payload: Date }
  | { type: "setShiftPattern"; payload: string }
  | { type: "setPlatoon"; payload: string }
  | { type: "setRotation"; payload: string }
  | { type: "setDayShiftStart"; payload: IShiftTime }
  | { type: "setDayShiftEnd"; payload: IShiftTime }
  | { type: "setNightShiftStart"; payload: IShiftTime }
  | { type: "setNightShiftEnd"; payload: IShiftTime };
