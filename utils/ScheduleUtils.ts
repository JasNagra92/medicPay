import {
  ITwoWeekPayPeriod,
  IUserInfo,
  ISingleDaysPayData,
} from "../interfaces/IAppState";
import { IScheduleItem, IPlatoonStart } from "../interfaces/IPlatoonStart";
import { sub } from "date-fns";
import { calculateFinalTotalProps, calculateTotal } from "./HourAndMoneyUtils";

const commonPlatoonStart1: IPlatoonStart = {
  A: 6,
  B: 4,
  C: 2,
  D: 0,
};
const commonPlatoonStart2: IPlatoonStart = {
  A: 5,
  B: 3,
  C: 1,
  D: 7,
};
const commonPlatoonStart3: IPlatoonStart = {
  A: 3,
  B: 1,
  C: 7,
  D: 5,
};
const commonPlatoonStart4: IPlatoonStart = {
  A: 2,
  B: 0,
  C: 5,
  D: 4,
};
const commonPlatoonStart5: IPlatoonStart = {
  A: 1,
  B: 7,
  C: 5,
  D: 3,
};
// object that has months as the keys, and the properties are every platoon, on day 1 of the corresponding month, where along the 4 on 4 off schedule the platoon begins, index 0 corresponds to Day 1, index 2 corresponds to Day 2 etc.., this will be used to find the current rotation from the user inputing a pay period start month and platoon
const platoonStarts2023: Record<number, IPlatoonStart> = {
  9: commonPlatoonStart1,
  10: commonPlatoonStart2,
  11: commonPlatoonStart3,
};
const platoonStarts2024: Record<number, IPlatoonStart> = {
  0: commonPlatoonStart4,
  1: commonPlatoonStart5,
  2: commonPlatoonStart1,
  3: commonPlatoonStart2,
  4: commonPlatoonStart3,
  5: commonPlatoonStart4,
  6: { A: 0, B: 6, C: 4, D: 2 },
  7: { A: 7, B: 5, C: 3, D: 1 },
  8: commonPlatoonStart1,
  9: { A: 4, B: 2, C: 0, D: 6 },
  10: commonPlatoonStart3,
  11: commonPlatoonStart5,
};
// the 4 on 4 of schedule
const rotation = [
  "Day 1",
  "Day 2",
  "Night 1",
  "Night 2",
  "day off",
  "day off",
  "day off",
  "day off",
];

export function getPayPeriodStart(payDay: Date): Date {
  const payPeriodStart = sub(payDay, { days: 21 });
  return payPeriodStart;
}

export function validatePlatoon(platoon: string) {
  if (!["A", "B", "C", "D"].includes(platoon)) {
    throw new Error("Platoon can only be A/B/C/D");
  }
}

// this function will create a 6 week schedule when given a pay day that the user picks, it will start from the first month of the pay period start date for the given pay day, and go for 6 weeks. After that schedule is created, it will then only return the 2 weeks that will be paid out on the given payday
export function getPayPeriodSchedule(
  payPeriodStart: Date,
  platoon: string
): IScheduleItem[] {
  // make sure the platoon is one of the 4 accepted values
  validatePlatoon(platoon);

  const payPeriodStartMonth: number = payPeriodStart.getMonth();

  // initialize an empty schedule that will be filled in a for loop
  let payPeriodSchedule = [];

  interface IPlatoonStarts {
    [year: number]: Record<number, IPlatoonStart>;
  }

  // get the starting index from the platoonStarts2023 or 2024 object
  const platoonStarts: IPlatoonStarts = {
    2023: platoonStarts2023,
    2024: platoonStarts2024,
    // Add additional platoonStarts object for other years as needed
  };

  // Function to get starting index based on the year
  const getStartingIndex = (
    payPeriodStart: Date,
    year: number,
    platoon: string
  ) => {
    const payPeriodStartMonth = payPeriodStart.getMonth();
    return platoonStarts[year][payPeriodStartMonth][platoon];
  };

  // Usage
  let startingIndex = getStartingIndex(
    payPeriodStart,
    payPeriodStart.getFullYear(),
    platoon
  );

  // define the rotaiton index using the starting index
  let rotationIndex = startingIndex;

  // Use a while loop to collect 14 items
  let i = 1;
  while (payPeriodSchedule.length < 14) {
    let currentDay = new Date(2023, payPeriodStartMonth, i);

    if (currentDay >= payPeriodStart) {
      payPeriodSchedule.push({
        date: currentDay,
        rotation: rotation[rotationIndex],
      });
    }

    // Increment the rotation index with a modulo operator to loop back to the start after reaching the 4th day off
    rotationIndex = (rotationIndex + 1) % rotation.length;
    i++;
  }

  return payPeriodSchedule;
}

// function should take a date and return true only if the date given as a parameter is a friday
export function validatePayday(date: Date): Boolean {
  return date.getDay() === 5 ? true : false;
}

// function to generate specified number of paydates start from given payday
export function generatePaydaysForYear(
  year: number,
  firstPayday: Date,
  numberOfPaydays: number
): Date[] {
  const paydays: Date[] = [firstPayday];

  for (let i = 1; i < numberOfPaydays; i++) {
    const nextPayday = new Date(firstPayday);
    nextPayday.setDate(nextPayday.getDate() + i * 14); // Incrementing 14 days for each iteration
    nextPayday.setFullYear(year); // Set the year to the provided year

    paydays.push(nextPayday);
  }

  return paydays;
}

// function that will be used when looping through the array of paydays in a year, to return the 2 weeks pay period data along with the days in that pay period
export function generateTwoWeekPayPeriodData(
  payDay: Date,
  userInfo: IUserInfo
): ITwoWeekPayPeriod {
  const payPeriodStart = getPayPeriodStart(payDay);
  const payPeriodSchedule = getPayPeriodSchedule(
    payPeriodStart,
    userInfo.platoon
  );

  const payDaysInPayPeriod: ISingleDaysPayData[] = payPeriodSchedule.map(
    (item) => {
      const { baseHoursWorked, nightShiftHoursWorked, weekendHoursWorked } =
        calculateFinalTotalProps(item, userInfo!);

      const singleDayPayData: ISingleDaysPayData = {
        day: item.date,
        rotation: item.rotation, // Assuming 'rotation' is a property of IScheduleItem
        baseHoursWorked: baseHoursWorked,
        baseTotal: baseHoursWorked * parseFloat(userInfo.hourlyWage),
        alphaHoursWorked: nightShiftHoursWorked, // Replace with actual calculation for alpha hours worked
        alphaTotal: nightShiftHoursWorked * 3.6, // Replace with actual calculation for alpha total
        nightHoursWorked: nightShiftHoursWorked,
        nightTotal: nightShiftHoursWorked * 2.0, // Assuming night shift pay rate is $2.00
        weekendHoursWorked: weekendHoursWorked,
        weekendTotal: weekendHoursWorked * 2.25, // Assuming weekend pay rate is $2.25
        dayTotal: 0, // Replace with total earnings for the day
      };

      singleDayPayData.dayTotal =
        singleDayPayData.baseTotal +
        singleDayPayData.alphaTotal +
        singleDayPayData.nightTotal +
        singleDayPayData.weekendTotal;

      return singleDayPayData;
    }
  );

  let totalEarnings: number = 0;
  let totalBaseHours: number = 0;
  let totalNightShiftHours: number = 0;
  let totalWeekendHours: number = 0;
  for (const item of payPeriodSchedule) {
    const { baseHoursWorked, nightShiftHoursWorked, weekendHoursWorked } =
      calculateFinalTotalProps(item, userInfo!);

    totalBaseHours += baseHoursWorked;
    totalNightShiftHours += nightShiftHoursWorked;
    totalWeekendHours += weekendHoursWorked;
    totalEarnings += calculateTotal(item, userInfo!);
  }

  const twoWeekPayPeriodData: ITwoWeekPayPeriod = {
    payDay,
    baseHoursWorkedInPayPeriod: totalBaseHours,
    nightHoursWorkedInPayPeriod: totalNightShiftHours,
    weekendHoursWorkedInPayPeriod: totalWeekendHours,
    alphaHoursWorkedInPayPeriod: totalNightShiftHours,
    totalEarnings,
    baseTotalEarnings: totalBaseHours * parseInt(userInfo.hourlyWage),
    nightShiftTotalEarnings: totalNightShiftHours * 2.0,
    alphaNightTotalEarnings: totalNightShiftHours * 3.2,
    weekendTotalEarnings: totalWeekendHours * 2.25,
    payDaysInPayPeriod: payDaysInPayPeriod,
  };

  return twoWeekPayPeriodData;
}
