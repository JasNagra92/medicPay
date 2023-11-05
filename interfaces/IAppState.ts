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
  shiftStart: Date;
  shiftEnd: Date;
}

export interface ITwoWeekPayPeriod {
  totalEarnings: number;
  baseHoursWorkedInPayPeriod: number;
  alphaHoursWorkedInPayPeriod: number;
  nightHoursWorkedInPayPeriod: number;
  weekendHoursWorkedInPayPeriod: number;
  baseTotalEarnings: number;
  alphaNightTotalEarnings: number;
  nightShiftTotalEarnings: number;
  weekendTotalEarnings: number;
  payDaysInPayPeriod: ISingleDaysPayData[];
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
  payDaysForYear?: {
    [payDay: string]: ITwoWeekPayPeriod; // Replace IScheduleItem with your specific structure
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
      type: "SET_PAY_DAYS_FOR_YEAR";
      payload: Record<string, ITwoWeekPayPeriod>;
    };
