import { IScheduleItem, IPlatoonStart } from "../interfaces/IPlatoonStart";
import { sub } from "date-fns";

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
  "day 1",
  "day 2",
  "night 1",
  "night 2",
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
  // get the starting index from the platoonStarts2023 object
  const startingIndex = platoonStarts2023[payPeriodStartMonth][platoon];
  // define the rotaiton index using the starting index
  let rotationIndex = startingIndex;

  // Use a while loop to collect 14 items
  let i = 0;
  while (payPeriodSchedule.length < 14) {
    let currentDay = new Date(2023, payPeriodStartMonth, 1 + i);

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
