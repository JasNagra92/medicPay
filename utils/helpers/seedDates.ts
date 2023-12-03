import { IUserInfo } from "../../interfaces/IAppState";
import { DateTime } from "luxon";

export const RDaySeedDates: Record<string, Record<string, string>> = {
  A: {
    R1: "2023-01-28",
    R2: "2023-01-12",
    R3: "2023-02-05",
    R4: "2023-01-20",
  },
  B: {
    R1: "2023-02-07",
    R2: "2023-01-22",
    R3: "2023-02-06",
    R4: "2023-01-30",
  },
  C: {
    R1: "2023-02-01",
    R2: "2023-01-08",
    R3: "2023-02-09",
    R4: "2023-01-16",
  },
  D: {
    R1: "2023-01-02",
    R2: "2023-01-18",
    R3: "2023-02-10",
    R4: "2023-01-26",
  },
};

export const isDayBeforeRDay = (userInfo: IUserInfo, date: Date): Boolean => {
  const { platoon, rotation } = userInfo;
  const dateToCheck = DateTime.fromJSDate(date);

  let seed = DateTime.fromISO(RDaySeedDates[platoon][rotation!]);
  let RDays = [];
  // loop from the seed date 40 days and store all the dates for the year that matches the date provided
  while (seed.year <= dateToCheck.year) {
    if (seed.year === dateToCheck.year) {
      RDays.push(seed.toISODate());
    }
    seed = seed.plus({ days: 40 });
  }

  return RDays.includes(
    DateTime.fromJSDate(date).minus({ days: 1 }).toISODate()
  )
    ? true
    : false;
};
