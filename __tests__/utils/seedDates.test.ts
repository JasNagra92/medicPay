import { isDayBeforeRDay } from "../../utils/helpers/seedDates";

describe("isDayBeforeRDay", () => {
  it("should take a platoon, rotation, and date, and then return true if the date minus 1, is one of that platoon and rotations R Days", () => {
    let userInfo = {
      id: "test",
      email: "test",
      shiftPattern: "Alpha",
      platoon: "A",
      rotation: "R1",
      dayShiftStartTime: { hours: 6, minutes: 0 },
      dayShiftEndTime: { hours: 18, minutes: 0 },
      nightShiftStartTime: { hours: 18, minutes: 0 },
      nightShiftEndTime: { hours: 6, minutes: 0 },
      hourlyWage: "43.13",
    };
    let date = new Date(2023, 2, 9);
    // march 9th is the 2nd rday of the year in 2023 for R1 A platoon
    expect(isDayBeforeRDay(userInfo, date)).toEqual(true);
  });
});
