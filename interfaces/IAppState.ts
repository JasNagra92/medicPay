export interface IShiftTime {
  hours: number;
  minutes: number;
}

export interface ISingleDaysPayData {
  day: Date;
  rotation: string; //day 1, day 2, //
  baseHoursWorked: number;
  baseTotal: number;
  alphaHoursWorked: number;
  alphaTotal: number;
  nightHoursWorked: number;
  nightTotal: number;
  weekendHoursWorked: number;
  weekendTotal: number;
  dayTotal: number;
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
  payDayPeriods?: {
    [payDay: string]: ISingleDaysPayData; // Replace IScheduleItem with your specific structure
  };
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
  | { type: "setNightShiftEnd"; payload: IShiftTime }
  | {
      type: "UPDATE_PAY_PERIODS";
      payload: { payDay: string; payPeriodSchedule: ISingleDaysPayData };
    };
