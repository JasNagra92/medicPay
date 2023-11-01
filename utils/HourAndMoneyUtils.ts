import { IUserInfo } from "../interfaces/IAppState";
import { IScheduleItem } from "../interfaces/IPlatoonStart";

const nightShiftStartHour: number = 18;
const nightShiftEndHour: number = 6;

// function to check if shift start and end are both fractions
export function bothFractions(shiftStart: Date, shiftEnd: Date): boolean {
  return shiftStart.getMinutes() !== 0 && shiftEnd.getMinutes() !== 0;
}

// function to check if both times are whole start times
export function bothWholeTimes(shiftStart: Date, shiftEnd: Date): boolean {
  return shiftStart.getMinutes() === 0 && shiftEnd.getMinutes() === 0;
}

// function to check if start time is a fraction and end is a whole
export function startFractionEndWhole(
  shiftStart: Date,
  shiftEnd: Date
): boolean {
  return shiftStart.getMinutes() !== 0 && shiftEnd.getMinutes() === 0;
}

// function to check if start is a whole and end is a fraction
export function endFractionStartWhole(
  shiftStart: Date,
  shiftEnd: Date
): boolean {
  return shiftStart.getMinutes() === 0 && shiftEnd.getMinutes() !== 0;
}

// function to return premium hours worked when both start/end times are whole
export function getNightShiftHoursBothWhole(
  shiftStart: Date,
  shiftEnd: Date
): number {
  let premiumHours = 0;

  const hoursWorked: number = getHoursWorked(shiftStart, shiftEnd);

  for (let hour = 0; hour < hoursWorked; hour++) {
    let currentHour = (shiftStart.getHours() + hour) % 24;

    if (isWithinNightShiftHours(currentHour)) {
      premiumHours += 1;
    }
  }

  return premiumHours;
}

// function to return premium hours when start time is a fraction but end time is whole
export function handleFractionalStart(
  shiftStart: Date,
  shiftEnd: Date
): number {
  let premiumHours = 0;
  const startHour = shiftStart.getHours();
  const startMinute = shiftStart.getMinutes();

  // Check if the hour part of the start time is within night shift hours
  if (isWithinNightShiftHours(startHour)) {
    // Calculate fraction of the start hour
    const fraction = startMinute / 60;
    premiumHours += fraction;
  }

  // Start looping from the next hour
  for (let hour = 1; hour <= getHoursWorked(shiftStart, shiftEnd); hour++) {
    let currentHour = (startHour + hour) % 24;

    if (isWithinNightShiftHours(currentHour)) {
      premiumHours += 1;
    }
  }

  return premiumHours;
}

// function to return premium hours with a whole start time but a fractional end
export function handleFractionalEnd(shiftStart: Date, shiftEnd: Date): number {
  let premiumHours = 0;
  const endHour = shiftEnd.getHours();
  const endMinute = shiftEnd.getMinutes();

  // Check if the hour part of the end time is within night shift hours
  if (isWithinNightShiftHours(endHour)) {
    // Calculate fraction of the end hour
    const fraction = endMinute / 60;
    premiumHours += fraction;
  }

  // Start looping from the start hour until the second-to-last whole hour
  for (let hour = 0; hour < getHoursWorked(shiftStart, shiftEnd) - 1; hour++) {
    let currentHour = (shiftStart.getHours() + hour) % 24;

    if (isWithinNightShiftHours(currentHour)) {
      premiumHours += 1;
    }
  }

  return premiumHours;
}

// function to return premium hours with a fractional start time and fractional end
export function handleBothFractions(shiftStart: Date, shiftEnd: Date): number {
  let premiumHours = 0;
  const startHour = shiftStart.getHours();
  const endHour = shiftEnd.getHours();
  const startMinute = shiftStart.getMinutes();
  const endMinute = shiftEnd.getMinutes();

  if (endHour === 0) {
    // If the shift ends around midnight, calculate hours from startHour to 24 (end of the day)
    for (let hour = startHour + 1; hour < 24; hour++) {
      if (isWithinNightShiftHours(hour)) {
        premiumHours += 1;
      }
    }
    // Then, consider the hours from midnight (0) to the endHour
    for (let hour = 0; hour < endHour; hour++) {
      if (isWithinNightShiftHours(hour)) {
        premiumHours += 1;
      }
    }
  } else {
    // Otherwise, use the regular loop
    for (let hour = startHour + 1; hour < endHour; hour++) {
      if (isWithinNightShiftHours(hour)) {
        premiumHours += 1;
      }
    }
  }

  // Calculate fraction for the start hour
  if (isWithinNightShiftHours(startHour)) {
    const startFraction = 1 - startMinute / 60;
    premiumHours += startFraction;
  }

  // Calculate fraction for the end hour
  if (isWithinNightShiftHours(endHour)) {
    const endFraction = endMinute / 60;
    premiumHours += endFraction;
  }

  return premiumHours;
}

// function to check if the given hour is between night shift
// premium hours
export function isWithinNightShiftHours(currentHour: number): Boolean {
  return currentHour >= nightShiftStartHour || currentHour < nightShiftEndHour
    ? true
    : false;
}

// function to return how many hours between 2 date objects fall within night shift premium hours
export function getNightShiftPremiumHoursWorked(
  shiftStart: Date,
  shiftEnd: Date
): number {
  let premiumHours = 0;

  const hoursWorked: number = getHoursWorked(shiftStart, shiftEnd);

  if (bothWholeTimes(shiftStart, shiftEnd)) {
    premiumHours = getNightShiftHoursBothWhole(shiftStart, shiftEnd);
  }
  if (startFractionEndWhole(shiftStart, shiftEnd)) {
    premiumHours = handleFractionalStart(shiftStart, shiftEnd);
  }
  if (endFractionStartWhole(shiftStart, shiftEnd)) {
    premiumHours = handleFractionalEnd(shiftStart, shiftEnd);
  }
  if (bothFractions(shiftStart, shiftEnd)) {
    premiumHours = handleBothFractions(shiftStart, shiftEnd);
  }

  return premiumHours;
}

// function to check specifically if the given hour is between
// 6pm on a friday night and midnight on friday night
// or if it is on Monday morning between 0000 hours and 0600
export function isWithinFridayNightOrMondayMorning(
  currentHour: number,
  currentDay: number
): Boolean {
  if (
    (currentHour >= 18 && currentDay === 5) ||
    (currentHour < 6 && currentDay === 1)
  ) {
    return true;
  } else {
    return false;
  }
}

// function to check if given hour takes place on a saturday or sunday
export function isWeekend(currentDay: number): Boolean {
  return currentDay === 6 || currentDay === 0 ? true : false;
}

// function to return how many hours between 2 date objects fall within weekend shift premium hours
export function getWeekendPremiumHoursWorked(
  shiftStart: Date,
  shiftEnd: Date
): number {
  let weekendPremiumHours = 0;

  const hoursWorked: number = getHoursWorked(shiftStart, shiftEnd);
  const isFractional = hoursWorked % 1 !== 0;
  const startHoursFraction = shiftStart.getMinutes() / 60;
  const isStartFraction = startHoursFraction > 0;

  for (let hour = 0; hour < hoursWorked; hour++) {
    let currentHour = (shiftStart.getHours() + hour) % 24;
    let currentDay = shiftStart.getDay();

    if (currentHour < shiftStart.getHours()) {
      currentDay = (currentDay + 1) % 7;
    }

    if (
      isWeekend(currentDay) ||
      isWithinFridayNightOrMondayMorning(currentHour, currentDay)
    ) {
      if (isStartFraction && hour === 0) {
        weekendPremiumHours += startHoursFraction;
      } else if (
        isFractional &&
        hour === Math.floor(hoursWorked) - 1 &&
        !isStartFraction // This is modified to address shiftEnd time
      ) {
        weekendPremiumHours += hoursWorked - Math.floor(hoursWorked);
      } else {
        weekendPremiumHours += 1;
      }
    }
  }

  return weekendPremiumHours;
}

// function to return total hours worked between 2 date objects
export function getHoursWorked(startTime: Date, endTime: Date): number {
  const startTimeMS: number = startTime.getTime();
  const endTimeMS: number = endTime.getTime();
  const hoursWorked: number = (endTimeMS - startTimeMS) / (1000 * 60 * 60);
  return hoursWorked;
}

// function to return the earnings from a shift given 2 Date object representing
// shift start and shift end times
export function calculateEarnings(
  startTime: Date,
  endTime: Date,
  baseRate: number,
  nightShiftPremium: number,
  weekendPremium: number
): string {
  let totalEarnings: number = 0;

  const hoursWorked = getHoursWorked(startTime, endTime);
  const endOfShiftHour = endTime.getHours();

  for (let hour = 0; hour <= hoursWorked; hour++) {
    let hourlyRate: number = baseRate;

    let currentHour = (startTime.getHours() + hour) % 24;
    let currentDay = startTime.getDay();

    // check if endOfShiftHour is equal to the current hour and then do not add anymore money because shift is over
    if (endOfShiftHour === currentHour) {
      return totalEarnings.toFixed(2);
    }

    // check if current day flipped to the next day in the current hour
    if (currentHour < startTime.getHours()) {
      (currentDay + 1) % 7;
    }

    // check if current hour is a night shift
    if (isWithinNightShiftHours(currentHour)) {
      hourlyRate += nightShiftPremium;

      // check if current hour is also a weekend or friday night/monday morning
      if (
        isWeekend(currentDay) ||
        isWithinFridayNightOrMondayMorning(currentHour, currentDay)
      ) {
        hourlyRate += weekendPremium;
      }
    }
    totalEarnings += hourlyRate;
  }
  return totalEarnings.toFixed(2);
}

// function to return a start time as date object when given a schedule item and a user info object. Schedule item will decide if a start date is to be generated using the day shift start times or the night shift start times from the user info object
export function generateStartTimeDate(
  scheduleItem: IScheduleItem,
  userInfo: IUserInfo
): Date {
  const { date, rotation } = scheduleItem;
  const { dayShiftStartTime, nightShiftStartTime } = userInfo;

  const [hours, minutes] =
    rotation === "day 1" || rotation === "day 2"
      ? [dayShiftStartTime.hours, dayShiftStartTime.minutes]
      : [nightShiftStartTime.hours, nightShiftStartTime.minutes];

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
}

// function to return a end time as date object when given a schedule item and a user info object. Schedule item will decide if a start date is to be generated using the day shift start times or the night shift start times from the user info object
export function generateEndTimeDate(
  scheduleItem: IScheduleItem,
  userInfo: IUserInfo
): Date {
  const { date, rotation } = scheduleItem;
  const { dayShiftEndTime, nightShiftEndTime } = userInfo;

  let hours, minutes;

  if (rotation === "day 1" || rotation === "day 2") {
    hours = dayShiftEndTime.hours;
    minutes = dayShiftEndTime.minutes;
  } else {
    hours = nightShiftEndTime.hours;
    minutes = nightShiftEndTime.minutes;
    // adjust the date to the next day because all night shifts end after midnight
    date.setDate(date.getDate() + 1);
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
}
