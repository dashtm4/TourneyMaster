import { IMultiSelectOption } from '../multi-select';

export enum DefaultSelectValues {
  ALL = 'all',
}

export enum DayTypes {
  DAY_ONE = 'Day 1',
  DAY_TWO = 'Day 2',
  DAY_THREE = 'Day 3',
}

export enum OptimizeTypes {
  MIN_RANK = 'Min Rank Difference',
  MAX_RANK = 'Max Rank Difference',
}

export interface IScheduleFilter {
  selectedDay?: DayTypes;
  divisionsOptions: IMultiSelectOption[];
  poolsOptions: IMultiSelectOption[];
  teamsOptions: IMultiSelectOption[];
  fieldsOptions: IMultiSelectOption[];
}
