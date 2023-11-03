import { getPayPeriodSchedule } from "../../utils/ScheduleUtils";
import {
  getPayPeriodStart,
  validatePayday,
  generatePaydaysForYear,
  generateTwoWeekPayPeriodData,
} from "../../utils/ScheduleUtils";
import { IScheduleItem } from "../../interfaces/IPlatoonStart";
import {
  ISingleDaysPayData,
  ITwoWeekPayPeriod,
  IUserInfo,
} from "../../interfaces/IAppState";

describe("getPayPeriodStart", () => {
  it("function returns Oct 13,2023, when given a pay day date of Nov 3rd, 2023, pay periods always start 21 days before pay day and run for 14 days", () => {
    const payDay = new Date(2023, 10, 3);
    const expectedDate = new Date(2023, 9, 13);

    expect(getPayPeriodStart(payDay)).toEqual(expectedDate);
  });
});

describe("getPayPeriodSchedule", () => {
  it("When given a pay day and a platoon by the user, it finds the start of the pay period for that pay day, finds the month that it is in, and then creates a 45 day schedule for the given platoon, in the format of an array filled with 45 objects, 1 object per day, {date: Date object, rotation: day 1/day 2/night 1/night 2/day off}, but only returns the 14 days of the pay period", () => {
    // user input
    const payDay: Date = new Date(2023, 10, 3);
    const platoon: string = "A";

    const payPeriodStart: Date = getPayPeriodStart(payDay);

    const schedule: IScheduleItem[] = getPayPeriodSchedule(
      payPeriodStart,
      platoon
    );

    expect(schedule).toHaveLength(14);
    expect(schedule[0].rotation).toBe("Night 1");
    expect(schedule[2].rotation).toBe("day off");
  });
  it("Day 1's date should be December 8th when given a payday of Dec 29th", () => {
    const payDay: Date = new Date(2023, 11, 29);
    const platoon: string = "C";

    const payPeriodStart: Date = getPayPeriodStart(payDay);

    const schedule: IScheduleItem[] = getPayPeriodSchedule(
      payPeriodStart,
      platoon
    );

    expect(schedule[0].date).toEqual(new Date(2023, 11, 8));
  });

  it("should throw an error if the platoon given is any letter other than A/B/C/D", () => {
    const payDay = new Date(2023, 10, 3);
    expect(() => getPayPeriodSchedule(payDay, "F")).toThrowError(
      "Platoon can only be A/B/C/D"
    );
  });
  it("first schedule item when given a payday of Dec 1st and C platoon, should be Nov 10th which is a Night 1", () => {
    const payDay: Date = new Date(2023, 11, 1);
    const platoon: string = "C";

    const payPeriodStart: Date = getPayPeriodStart(payDay);

    const schedule: IScheduleItem[] = getPayPeriodSchedule(
      payPeriodStart,
      platoon
    );

    expect(schedule[0].rotation).toEqual("Night 1");
  });
  it("first schedule item when given a payday of Dec 1st and A platoon, should be Nov 10th which is a day off", () => {
    const payDay: Date = new Date(2023, 11, 1);
    const platoon: string = "A";

    const payPeriodStart: Date = getPayPeriodStart(payDay);

    const schedule: IScheduleItem[] = getPayPeriodSchedule(
      payPeriodStart,
      platoon
    );

    expect(schedule[0].rotation).toEqual("day off");
    expect(schedule[0].date).toEqual(new Date(2023, 10, 10));
  });
});

describe("validatePayday", () => {
  it("should return true if given date is a friday", () => {
    const dateToTest = new Date(2023, 9, 20);

    expect(validatePayday(dateToTest)).toBe(true);
  });
});

describe("generateAll2024", () => {
  it("should return an array of 26 items when given a year of 2024, first payday of Jan 15th, and number of paydays 26", () => {
    let payDaysFor2024: Date[] = generatePaydaysForYear(
      2024,
      new Date(2024, 0, 12),
      26
    );

    expect(payDaysFor2024[0]).toEqual(new Date(2024, 0, 12));
    expect(payDaysFor2024.length).toEqual(26);
    expect(payDaysFor2024[25]).toEqual(new Date(2024, 11, 27));
  });
});

describe("generateTwoWeekPayPeriodData", () => {
  it("should be given a PayDay, and return a TwoWeekPayPeriod object with all the required fields from the interface", () => {
    // November 3rd
    const payDay = new Date(2023, 10, 3);
    const sampleUserData: IUserInfo = {
      hourlyWage: "43.13",
      payDay,
      shiftPattern: "Alpha",
      platoon: "A",
      dayShiftStartTime: { hours: 6, minutes: 0 },
      dayShiftEndTime: { hours: 18, minutes: 0 },
      nightShiftStartTime: { hours: 18, minutes: 0 },
      nightShiftEndTime: { hours: 6, minutes: 0 },
    };

    const result: ITwoWeekPayPeriod = generateTwoWeekPayPeriodData(
      payDay,
      sampleUserData
    );
    console.log(result);
    expect(result.payDay).toBeInstanceOf(Date);
    expect(result).toHaveProperty("payDay");
    expect(result).toHaveProperty("totalEarnings");
    expect(result).toHaveProperty("baseTotalEarnings");

    expect(Array.isArray(result.payDaysInPayPeriod)).toBe(true);
    expect(result.payDaysInPayPeriod).toHaveLength(14); // Assuming it's 14 days in the pay period
  });
});

describe("createDayOffData", () => {});

describe("createWorkDayData", () => {});

describe("getPayDaysInPayPeriod", () => {});
