export interface IShiftTime {
  hours: number;
  minutes: number;
}

export interface ISingleDaysPayData {
  date: Date;
  rotation: string; //Day 1, Day 2, Night 1 //
  shiftStart: Date;
  shiftEnd: Date;
  baseHoursWorked: number;
  baseWageEarnings: number;
  nightHoursWorked: number;
  alphaNightsEarnings: number;
  nightEarnings: number;
  weekendHoursWorked: number;
  weekendEarnings: number;
  dayTotal: number;
  stiipHours?: number;
}

export interface IPayPeriodData {
  payDay: string;
  workDaysInPayPeriod: ISingleDaysPayData[];
}

export interface ITwoWeekPayPeriod {
  getBaseWageEarnings: () => number;
  getTotalEarnings: () => number;
  getNightHoursWorked: () => number;
  baseHoursWorkedInPayPeriod: number;
  levellingHours: number;
  nightHoursWorkedInPayPeriod: number;
  weekendHoursWorkedInPayPeriod: number;
  alphaNightTotalEarnings: number;
  nightShiftTotalEarnings: number;
  weekendTotalEarnings: number;
  payDaysInPayPeriod: ISingleDaysPayData[];
}

export interface IUserInfo {
  id: string;
  email: string;
  shiftPattern: string;
  platoon: string;
  dayShiftStartTime: IShiftTime;
  dayShiftEndTime: IShiftTime;
  nightShiftStartTime: IShiftTime;
  nightShiftEndTime: IShiftTime;
  Rday?: string; // R1, R2 etc //
  hourlyWage: string;
  payDayToDisplay?: string | undefined;
  payMonthAndYearToDisplay?: string | undefined;
}

export type UserInfoAction =
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
  | {
      type: "SET_PAY_DAYS_FOR_YEAR";
      payload: Record<string, ITwoWeekPayPeriod>;
    };

export type PayPeriodAction =
  | {
      type: "updateSingleDay";
      payload: { index: number; updatedSingleDay: ISingleDaysPayData };
    }
  | {
      type: "setPayPeriod";
      payload: IPayPeriodData;
    };
