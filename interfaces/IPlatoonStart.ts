export interface IPlatoonStart {
  [platoon: string]: number;
}

export interface IScheduleItem {
  date: Date;
  // rotation here with be "Day 1", "Day 2", "Night 1" etc.
  rotation: string;
}
