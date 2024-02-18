import {
  IPayPeriodData,
  ISingleDaysPayData,
  IUserInfo,
} from "../../interfaces/IAppState";

export function calculatePayData(
  payPeriod: IPayPeriodData[],
  indexInMonth: number,
  userInfo: IUserInfo
) {
  let baseHoursWorkedInPayPeriod = payPeriod[
    indexInMonth
  ].workDaysInPayPeriod.reduce(
    (total: number, day: ISingleDaysPayData) => total + day.baseHoursWorked,
    0
  );

  let stiipHours = payPeriod[indexInMonth].workDaysInPayPeriod.reduce(
    (total: number, day: ISingleDaysPayData) =>
      total + (day.stiipHours ? day.stiipHours : 0),
    0
  );

  let gross = payPeriod[indexInMonth].workDaysInPayPeriod.reduce(
    (total: number, day: ISingleDaysPayData) => total + day.dayTotal,
    0
  );

  let OTOnePointFive = payPeriod[indexInMonth].workDaysInPayPeriod.reduce(
    (total: number, day: ISingleDaysPayData) =>
      total + (day.OTOnePointFive ? day.OTOnePointFive : 0),
    0
  );

  let OTDoubleTime = payPeriod[indexInMonth].workDaysInPayPeriod.reduce(
    (total: number, day: ISingleDaysPayData) =>
      total + (day.OTDoubleTime ? day.OTDoubleTime : 0),
    0
  );

  let RDayInPeriod = payPeriod[indexInMonth].workDaysInPayPeriod.find(
    (day: ISingleDaysPayData) =>
      day.rotation === "R Day" || day.rotation === "R Day OT"
  );

  let statDayInPeriod = payPeriod[indexInMonth].workDaysInPayPeriod.find(
    (day: ISingleDaysPayData) => day.OTStatReg! > 0
  );

  let superStatDaysInPeriod = payPeriod[
    indexInMonth
  ].workDaysInPayPeriod.filter(
    (day: ISingleDaysPayData) => day.OTSuperStat! > 0
  );

  let OTStatReg = statDayInPeriod ? statDayInPeriod.OTStatReg! : 0;

  let OTSuperStat = superStatDaysInPeriod.reduce(
    (total: number, day: ISingleDaysPayData) => total + day.OTSuperStat!,
    0
  );

  let fullPaidSickDaysInPeriod = payPeriod[
    indexInMonth
  ].workDaysInPayPeriod.filter(
    (day: ISingleDaysPayData) => day.sickPaidHours && day.sickPaidHours > 0
  );

  let sickPaidHours = fullPaidSickDaysInPeriod.reduce(
    (total: number, day: ISingleDaysPayData) => total + day.sickPaidHours!,
    0
  );

  gross +=
    ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) -
      (baseHoursWorkedInPayPeriod +
        stiipHours +
        sickPaidHours +
        (RDayInPeriod ? 12 : 0) +
        OTStatReg +
        OTSuperStat)) *
      parseFloat(userInfo?.hourlyWage!) +
    8.29;

  let level =
    baseHoursWorkedInPayPeriod +
    stiipHours +
    sickPaidHours +
    OTStatReg +
    OTSuperStat;

  let levelledWage =
    ((userInfo?.shiftPattern === "Alpha" ? 80 : 77) - level) *
    parseFloat(userInfo?.hourlyWage!);

  let incomeLessLevelling = gross - levelledWage - 8.29;

  return {
    gross: gross,
    incomeLessLevelling: incomeLessLevelling,
    stiipHours: stiipHours,
    OTOnePointFive: OTOnePointFive,
    OTDoubleTime: OTDoubleTime,
    OTStatReg: OTStatReg,
    OTSuperStat: OTSuperStat,
  };
}
