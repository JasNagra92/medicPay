import {
  isWithinNightShiftHours,
  isWeekend,
  isWithinFridayNightOrMondayMorning,
  getHoursWorked,
} from "./utils";

const baseRate: number = 43.13;
const nightShiftPremium: number = 5.6;
const weekendPremium: number = 2.25;
let nightShiftStartHour: number = 18; // 6:00 pm //
let nightShiftEndHour: number = 6; // 6:00 am //

const startTime: Date = new Date(2023, 9, 8, 18, 0, 0);
const endTime: Date = new Date(2023, 9, 9, 6, 0, 0);

let totalEarnings: number = 0;

const calculateEarnings = (shiftStart: Date, shiftEnd: Date): string => {
  const hoursWorked: number = getHoursWorked(shiftStart, shiftEnd);

  for (let hour = 0; hour < hoursWorked; hour++) {
    const currentHour: number = (shiftStart.getHours() + hour) % 24;
    let currentDay: number = shiftStart.getDay();

    // adjust currentDay based on the currentHour to handle day transitions
    currentDay =
      currentHour < shiftStart.getHours() ? (currentDay + 1) % 7 : currentDay;

    let hourlyRate: number = baseRate;

    // First check if the given hour is within night shift hours
    if (isWithinNightShiftHours(currentHour)) {
      hourlyRate += nightShiftPremium;
      // further check if it is also a weekend or monday morning/friday night
      // for weekend premium
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
};

console.log(calculateEarnings(startTime, endTime));
