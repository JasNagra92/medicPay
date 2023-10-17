export interface IPlatoonStart {
  [platoon: string]: number;
}

export interface IScheduleItem {
  date: Date;
  rotation: string;
}
