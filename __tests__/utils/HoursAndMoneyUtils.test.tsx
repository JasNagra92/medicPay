import {
  isWithinNightShiftHours,
  isWithinFridayNightOrMondayMorning,
  isWeekend,
  getHoursWorked,
  calculateEarnings,
  getPayPeriodStart,
} from "../../utils/HourAndMoneyUtils.ts";

import { IScheduleItem } from "../../interfaces/platoonStart.ts";

const baseRate: number = 43.13;
const nightShiftPremium: number = 5.6;
const weekendPremium: number = 2.25;

describe("isWIthinNightShiftHours", () => {
  it("returns true if given hour is after 6pm", () => {
    const hour: number = 19;
    expect(isWithinNightShiftHours(hour)).toBe(true);
  });
  it("returns false if a given hour is between 6am and 6pm", () => {
    const hour: number = 15;
    expect(isWithinNightShiftHours(hour)).toBe(false);
  });
  it("returns true if given hour is at 6pm", () => {
    const hour: number = 18;
    expect(isWithinNightShiftHours(hour)).toBe(true);
  });
});

describe("isWithinFridayNightOrMondayMorning", () => {
  it("returns true if given hour and day are between 6pm and midnight on a friday", () => {
    const hour: number = 19;
    const day: number = 5;
    expect(isWithinFridayNightOrMondayMorning(hour, day)).toBe(true);
  });
  it("returns true for an hour on monday morning before 6am", () => {
    const hour: number = 3;
    const day: number = 1;
    expect(isWithinFridayNightOrMondayMorning(hour, day)).toBe(true);
  });
  it("returns true if given hour and day is friday at 6pm", () => {
    const hour: number = 18;
    const day: number = 5;
    expect(isWithinFridayNightOrMondayMorning(hour, day)).toBe(true);
  });
  it("returns false if given hour and day is before 6pm on a friday", () => {
    const hour: number = 17;
    const day: number = 5;
    expect(isWithinFridayNightOrMondayMorning(hour, day)).toBe(false);
  });
  it("returns false if given hour is monday at 6am", () => {
    const hour: number = 6;
    const day: number = 1;
    expect(isWithinFridayNightOrMondayMorning(hour, day)).toBe(false);
  });
});

describe("isWeekend", () => {
  it("returns true when given saturday or sunday as currentDay", () => {
    const currentDay: number = 6;
    expect(isWeekend(currentDay)).toBe(true);
  });
  it("returns true when given saturday or sunday as currentDay", () => {
    const currentDay: number = 0;
    expect(isWeekend(currentDay)).toBe(true);
  });
  it("returns false when day is not saturday or sunday", () => {
    const currentDay: number = 3;
    expect(isWeekend(currentDay)).toBe(false);
  });
});

describe("getHoursWorked", () => {
  it("returns 12 when given 2 start times 12 hours apart", () => {
    const startTime: Date = new Date(2023, 9, 5, 18, 0, 0);
    const endTime: Date = new Date(2023, 9, 6, 6, 0, 0);
    expect(getHoursWorked(startTime, endTime)).toBe(12);
  });
  it("returns 8 when given 2 dates 8 hours apart", () => {
    const startTime: Date = new Date(2023, 9, 5, 22, 0, 0);
    const endTime: Date = new Date(2023, 9, 6, 6, 0, 0);
    expect(getHoursWorked(startTime, endTime)).toBe(8);
  });
});

describe("calculateEarnings", () => {
  it("returns 517.56 when given a base rate of 43.13 and a start and end time that is a weekday day shift", () => {
    const startTime = new Date(2023, 9, 16, 6);
    const endTime = new Date(2023, 9, 16, 18);

    expect(
      calculateEarnings(
        startTime,
        endTime,
        baseRate,
        nightShiftPremium,
        weekendPremium
      )
    ).toBe("517.56");
  });
  it("returns 611.76 when given start and end times that fall on a weekend night shift", () => {
    const startTime = new Date(2023, 9, 15, 18);
    const endTime = new Date(2023, 9, 16, 6);

    expect(
      calculateEarnings(
        startTime,
        endTime,
        baseRate,
        nightShiftPremium,
        weekendPremium
      )
    ).toBe("611.76");
  });
});

describe("getPayPeriodStart", () => {
  it("function returns Oct 13,2023, when given a pay day date of Nov 3rd, 2023", () => {
    const payDay = new Date(2023, 10, 3);
    const expectedDate = new Date(2023, 9, 13);

    expect(getPayPeriodStart(payDay)).toEqual(expectedDate);
  });
});
