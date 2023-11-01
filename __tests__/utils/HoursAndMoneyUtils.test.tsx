import {
  isWithinNightShiftHours,
  isWithinFridayNightOrMondayMorning,
  isWeekend,
  getHoursWorked,
  calculateEarnings,
  generateStartTimeDate,
  generateEndTimeDate,
  getNightShiftPremiumHoursWorked,
  getWeekendPremiumHoursWorked,
} from "../../utils/HourAndMoneyUtils.ts";
import { IUserInfo } from "../../interfaces/IAppState.ts";

import { IScheduleItem } from "../../interfaces/IPlatoonStart.ts";

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

describe("generateStartTimeDate", () => {
  it("should return a date object with the correct start time using the info from the userinfo object as well as a schedule item", () => {
    let userInfoTest: IUserInfo = {
      hourlyWage: "",
      payDay: new Date(),
      shiftPattern: "",
      platoon: "A",
      dayShiftStartTime: { hours: 6, minutes: 0 },
      dayShiftEndTime: { hours: 0, minutes: 0 },
      nightShiftStartTime: { hours: 0, minutes: 0 },
      nightShiftEndTime: { hours: 0, minutes: 0 },
    };

    let scheduleItem = { date: new Date(2023, 9, 27), rotation: "day 1" };

    let expectedDate = new Date(2023, 9, 27, 6, 0);

    let result = generateStartTimeDate(scheduleItem, userInfoTest);
    expect(result).toEqual(expectedDate);
  });

  it("should return a date object with the correct end time using the info from the userinfo object as well as a schedule item when its a night shift", () => {
    let userInfoTest: IUserInfo = {
      hourlyWage: "",
      payDay: new Date(),
      shiftPattern: "",
      platoon: "A",
      dayShiftStartTime: { hours: 0, minutes: 0 },
      dayShiftEndTime: { hours: 0, minutes: 0 },
      nightShiftStartTime: { hours: 18, minutes: 0 },
      nightShiftEndTime: { hours: 0, minutes: 0 },
    };

    let scheduleItem = { date: new Date(2023, 9, 27), rotation: "night 1" };

    let expectedDate = new Date(2023, 9, 27, 18, 0);

    let result = generateStartTimeDate(scheduleItem, userInfoTest);
    expect(result).toEqual(expectedDate);
  });
});

describe("generateEndTimeDate", () => {
  it("should return a date object with the correct end time using the info from the userinfo object as well as a schedule item when its a day shift", () => {
    let userInfoTest: IUserInfo = {
      hourlyWage: "",
      payDay: new Date(),
      shiftPattern: "",
      platoon: "A",
      dayShiftStartTime: { hours: 0, minutes: 0 },
      dayShiftEndTime: { hours: 18, minutes: 0 },
      nightShiftStartTime: { hours: 0, minutes: 0 },
      nightShiftEndTime: { hours: 0, minutes: 0 },
    };

    let scheduleItem = { date: new Date(2023, 9, 27), rotation: "day 1" };

    let expectedDate = new Date(2023, 9, 27, 18, 0);

    let result = generateEndTimeDate(scheduleItem, userInfoTest);
    expect(result).toEqual(expectedDate);
  });
  it("should return a date object with the correct end time using the info from the userinfo object as well as a schedule item when its a night shift, should be the next day ", () => {
    let userInfoTest: IUserInfo = {
      hourlyWage: "",
      payDay: new Date(),
      shiftPattern: "",
      platoon: "A",
      dayShiftStartTime: { hours: 0, minutes: 0 },
      dayShiftEndTime: { hours: 18, minutes: 0 },
      nightShiftStartTime: { hours: 0, minutes: 0 },
      nightShiftEndTime: { hours: 6, minutes: 0 },
    };

    let scheduleItem = { date: new Date(2023, 9, 27), rotation: "night 1" };

    let expectedDate = new Date(2023, 9, 28, 6, 0);

    let result = generateEndTimeDate(scheduleItem, userInfoTest);
    expect(result).toEqual(expectedDate);
  });
});

describe("getNightShiftPremiumHoursWorked", () => {
  it("should return 12 if hours worked all fall between 1800 and 0600", () => {
    let shiftStart: Date = new Date(2023, 9, 15, 18);
    let shiftEnd: Date = new Date(2023, 9, 16, 6);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(12);
  });
  it("should return 0 if the start and end times are both during the day", () => {
    let shiftStart: Date = new Date(2023, 9, 15, 6);
    let shiftEnd: Date = new Date(2023, 9, 15, 18);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(0);
  });
  it("should return 9 if start time is 2100 and end time is 0900", () => {
    let shiftStart: Date = new Date(2023, 9, 15, 21);
    let shiftEnd: Date = new Date(2023, 9, 16, 9);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(9);
  });
  it("should return 6.5 if start time is friday night at 1800 and end time is saturday morning at 0030", () => {
    let shiftStart: Date = new Date(2023, 9, 27, 18);
    let shiftEnd: Date = new Date(2023, 9, 28, 0, 30);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  });
  it("should return 6.5 if start time is sunday night at 2330 and end time is monday morning at 0600", () => {
    let shiftStart: Date = new Date(2023, 9, 22, 23, 30);
    let shiftEnd: Date = new Date(2023, 9, 23, 6);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  });
  it("should return 5.5 if start time is friday night at 1830 and end time is saturday night at 0000", () => {
    let shiftStart: Date = new Date(2023, 9, 20, 18, 30);
    let shiftEnd: Date = new Date(2023, 9, 21, 0);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(5.5);
  });
  it("should return 6 if start time is friday night at 1730 and end time is saturday night at 0000", () => {
    let shiftStart: Date = new Date(2023, 9, 20, 17, 30);
    let shiftEnd: Date = new Date(2023, 9, 21, 0);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6);
  });
  it("should return 5.5 if start time is friday night at 1830 and end time is saturday night at 0030", () => {
    let shiftStart: Date = new Date(2023, 9, 20, 18, 30);
    let shiftEnd: Date = new Date(2023, 9, 21, 0, 30);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6);
  });
  it("should return 6.5 if start time is friday night at 1730 and end time is saturday night at 0030", () => {
    let shiftStart: Date = new Date(2023, 9, 20, 17, 30);
    let shiftEnd: Date = new Date(2023, 9, 21, 0, 30);

    expect(getNightShiftPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  });
});

describe("getWeekendPremiumHoursWorked", () => {
  it("should return 12 if start time and end time is a 12 hour shift between friday night at 1800 and monday morning at 0600", () => {
    let shiftStart: Date = new Date(2023, 9, 28, 6);
    let shiftEnd: Date = new Date(2023, 9, 28, 18);

    expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(12);
  });

  it("should return 3 if shift starts on a friday day at 0900 and ends friday night at 2100", () => {
    let shiftStart: Date = new Date(2023, 9, 27, 9);
    let shiftEnd: Date = new Date(2023, 9, 27, 21);

    expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(3);
  });
  it("should return 6.5 if start time is friday night at 1800 and end time is saturday morning at 0030", () => {
    let shiftStart: Date = new Date(2023, 9, 27, 18);
    let shiftEnd: Date = new Date(2023, 9, 28, 0, 30);

    expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  });
  it("should return 6.5 if start time is sunday night at 2330 and end time is monday morning at 0630", () => {
    let shiftStart: Date = new Date(2023, 9, 22, 23, 30);
    let shiftEnd: Date = new Date(2023, 9, 23, 6, 30);

    expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  });
  it("should return 6.5 if start time is sunday night at 2330 and end time is monday morning at 0600", () => {
    let shiftStart: Date = new Date(2023, 9, 22, 23, 30);
    let shiftEnd: Date = new Date(2023, 9, 23, 6);

    expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  });
  it("should return 6 if start time is friday day at 1730 and end time is saturday morning at 0600", () => {
    let shiftStart: Date = new Date(2023, 9, 20, 17, 30);
    let shiftEnd: Date = new Date(2023, 9, 21, 0);

    expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6);
  });
  // it("should return 6.5 if start time is friday day at 1230 and end time is saturday morning at 0030", () => {
  //   let shiftStart: Date = new Date(2023, 9, 20, 12, 30);
  //   let shiftEnd: Date = new Date(2023, 9, 21, 0, 30);

  //   expect(getWeekendPremiumHoursWorked(shiftStart, shiftEnd)).toBe(6.5);
  // });
});
