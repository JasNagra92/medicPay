import { getPayPeriodSchedule } from "../../utils/ScheduleUtils";
import { getPayPeriodStart, validatePayday } from "../../utils/ScheduleUtils";
import { IScheduleItem } from "../../interfaces/IPlatoonStart";

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
