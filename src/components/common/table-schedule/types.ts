export enum DefaulSelectFalues {
  ALL = 'all',
}

export enum DayTypes {
  DAY_ONE = 'Day 1',
  DAY_TWO = 'Day 2',
  DAY_THREE = 'Day 3',
}

export interface IScheduleFilter {
  selectedDay: DayTypes;
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
}
