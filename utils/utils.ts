const nightShiftStartHour: number = 18;
const nightShiftEndHour: number = 6;

// function to check if the given hour is between night shift
// premium hours
export function isWithinNightShiftHours(currentHour: number): Boolean {
  return currentHour >= nightShiftStartHour || currentHour < nightShiftEndHour
    ? true
    : false;
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
  for (let hour = 0; hour <= hoursWorked; hour++) {
    let hourlyRate: number = baseRate;

    let currentHour = (startTime.getHours() + hour) % 24;
    let currentDay = startTime.getDay();

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
    return totalEarnings.toFixed(2);
  }
}
