export interface IShiftTime {
  hours: number;
  minutes: number;
}

export interface IStiipUpdatePayload {
  usedStiip: boolean;
  stiipHours: number;
  workDayToUpdate: string;
  payDayOnDisplay: string;
  hourlyWage: string;
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
  usedStiip?: boolean;
  stiipHours?: number;
}

export interface ITwoWeekPayPeriod {
  totalEarnings: number;
  baseHoursWorkedInPayPeriod: number;
  levellingHours: number;
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
  payDayToDisplay?: string | undefined;
  payMonthAndYearToDisplay?: string | undefined;
  shiftPattern: string;
  rotation?: string;
  platoon: string;
  dayShiftStartTime: IShiftTime;
  dayShiftEndTime: IShiftTime;
  nightShiftStartTime: IShiftTime;
  nightShiftEndTime: IShiftTime;
  payDaysForYear?: {
    [payDay: string]: ITwoWeekPayPeriod;
  };
}

export type Action =
  | { type: "setHourlyWage"; payload: string }
  | { type: "setPaydayToDisplay"; payload: string }
  | { type: "setPayMonthAndYearToDisplay"; payload: string }
  | { type: "setShiftPattern"; payload: string }
  | { type: "setPlatoon"; payload: string }
  | { type: "setRotation"; payload: string }
  | { type: "setDayShiftStart"; payload: IShiftTime }
  | { type: "setDayShiftEnd"; payload: IShiftTime }
  | { type: "setNightShiftStart"; payload: IShiftTime }
  | { type: "setNightShiftEnd"; payload: IShiftTime }
  | { type: "setUsedStiip"; payload: IStiipUpdatePayload }
  | {
      type: "SET_PAY_DAYS_FOR_YEAR";
      payload: Record<string, ITwoWeekPayPeriod>;
    };
