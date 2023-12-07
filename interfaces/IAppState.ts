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
  OTStatReg?: number;
  baseWageEarnings: number;
  nightHoursWorked: number;
  alphaNightsEarnings: number;
  nightEarnings: number;
  weekendHoursWorked: number;
  weekendEarnings: number;
  dayTotal: number;
  stiipHours?: number;
  OTOnePointFive?: number;
  OTDoubleTime?: number;
  [key: string]: number | Date | string | undefined;
}

export interface IPayPeriodData {
  payDay: string;
  workDaysInPayPeriod: ISingleDaysPayData[];
  cpp: number;
  ei: number;
  incomeTax: number;
  pserp: number;
  unionDues: number;
  netIncome: number;
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
  rotation?: string; // R1, R2 etc //
  hourlyWage: string;
  payDayToDisplay?: string | undefined;
  payMonthAndYearToDisplay?: string | undefined;
}

export type UserInfoAction =
  | { type: "setHourlyWage"; payload: string }
  | { type: "setUserId"; payload: string }
  | { type: "setPaydayToDisplay"; payload: string }
  | { type: "setPayMonthAndYearToDisplay"; payload: string }
  | { type: "setShiftPattern"; payload: string }
  | { type: "setPlatoon"; payload: string }
  | { type: "setRotation"; payload: string }
  | { type: "setDayShiftStart"; payload: IShiftTime }
  | { type: "setDayShiftEnd"; payload: IShiftTime }
  | { type: "setNightShiftStart"; payload: IShiftTime }
  | { type: "setNightShiftEnd"; payload: IShiftTime };

export type PayPeriodAction =
  | {
      type: "updateSingleDay";
      payload: {
        indexInMonth: number;
        indexInWorkDays: number;
        updatedSingleDay: ISingleDaysPayData;
      };
    }
  | {
      type: "setPayPeriod";
      payload: IPayPeriodData[];
    }
  | {
      type: "updateHolidayBlock";
      payload: {
        indexInMonth: number;
        indexInWorkDays: number;
        updatedDays: ISingleDaysPayData[];
      };
    }
  | {
      type: "updateDeductions";
      payload: {
        indexInMonth: number;
        ei: number;
        cpp: number;
        incomeTax: number;
        netIncome: number;
        unionDues: number;
        pserp: number;
      };
    };
