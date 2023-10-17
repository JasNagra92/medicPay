import { getSixWeekSchedule } from "../../utils/ScheduleUtils";
import { getPayPeriodStart } from "../../utils/HourAndMoneyUtils";
import { IScheduleItem } from "../../interfaces/platoonStart";

describe("a function", () => {
  it("When given a pay day and a platoon by the user, it finds the start of the pay period for that pay day, finds the month that it is in, and then creates a 45 day schedule for the given platoon, in the format of an array filled with 45 objects, 1 object per day, {date: Date object, rotation: day 1/day 2/night 1/night 2/day off}", () => {
    // user input
    const payDay: Date = new Date(2023, 10, 3);
    const platoon: string = "A";

    const payPeriodStartMonth: number = getPayPeriodStart(payDay).getMonth();

    const schedule: IScheduleItem[] = getSixWeekSchedule(
      payPeriodStartMonth,
      platoon
    );
    console.log(schedule);

    expect(payPeriodStartMonth).toBe(9);
    expect(schedule).toHaveLength(45);
    expect(schedule[0].rotation).toBe("day off");
    expect(schedule[2].rotation).toBe("day 1");
  });
});
