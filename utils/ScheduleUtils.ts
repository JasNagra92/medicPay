import { IScheduleItem, IPlatoonStart } from "../interfaces/platoonStart";

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

export function getSixWeekSchedule(
  payPeriodStartMonth: number,
  platoon: string
): IScheduleItem[] {
  // make sure the platoon is one of the 4 accepted values
  if (
    platoon !== "A" &&
    platoon !== "B" &&
    platoon !== "C" &&
    platoon !== "D"
  ) {
    throw new Error("Platoon can only be A/B/C/D");
  }

  //   make sure the month is also between 0 and 11
  if (payPeriodStartMonth < 0 || payPeriodStartMonth > 11) {
    throw new Error("Pay period start month must be between 0 and 11");
  }

  // initialize an empty schedule that will be filled in a for loop
  const schedule = [];
  // get the starting index from the platoonStarts2023 object
  const startingIndex = platoonStarts2023[payPeriodStartMonth][platoon];
  // define the rotaiton index using the starting index
  let rotationIndex = startingIndex;
  // loop for 45 days but have the first entry be the rotation index, which will be different based on the platoon and month provided by the user
  for (let i = 0; i < 45; i++) {
    let currentDay = new Date(2023, payPeriodStartMonth, 1 + i);

    schedule.push({ date: currentDay, rotation: rotation[rotationIndex] });

    // increment the rotation index with a modulo operator to loop back to the start after reaching the 4th day off
    rotationIndex = (rotationIndex + 1) % rotation.length;
  }

  return schedule;
}
