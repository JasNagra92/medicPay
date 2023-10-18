import { getPayPeriodSchedule } from "../../utils/ScheduleUtils";
import { getPayPeriodStart } from "../../utils/ScheduleUtils";
import { IScheduleItem } from "../../interfaces/IPlatoonStart";

describe("getPayPeriodStart", () => {
  it("function returns Oct 13,2023, when given a pay day date of Nov 3rd, 2023, pay periods always start 21 days before pay day and run for 14 days", () => {
    const payDay = new Date(2023, 10, 3);
    const expectedDate = new Date(2023, 9, 13);

    expect(getPayPeriodStart(payDay)).toEqual(expectedDate);
  });
});

describe("getPayPeriodSchedule", () => {
  it("When given a pay day and a platoon by the user, it finds the start of the pay period for that pay day, finds the month that it is in, and then creates a 45 day schedule for the given platoon, in the format of an array filled with 45 objects, 1 object per day, {date: Date object, rotation: day 1/day 2/night 1/night 2/day off}", () => {
    // user input
    const payDay: Date = new Date(2023, 10, 3);
    const platoon: string = "A";

    const payPeriodStart: Date = getPayPeriodStart(payDay);

    const schedule: IScheduleItem[] = getPayPeriodSchedule(
      payPeriodStart,
      platoon
    );

    expect(schedule).toHaveLength(14);
    expect(schedule[0].rotation).toBe("night 1");
    expect(schedule[2].rotation).toBe("day off");
  });

  it("should throw an error if the platoon given is any letter other than A/B/C/D", () => {
    const payDay = new Date(2023, 10, 3);
    expect(() => getPayPeriodSchedule(payDay, "F")).toThrowError(
      "Platoon can only be A/B/C/D"
    );
  });
});
