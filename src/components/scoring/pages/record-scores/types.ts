import { IField } from 'common/models';

export interface IFieldWithRelated extends IField {
  relatedTo: string;
}

enum DefaulSelectFalues {
  ALL = 'all',
}

enum DayTypes {
  DAY_ONE = 'Day 1',
  DAY_TWO = 'Day 2',
  DAY_THREE = 'Day 3',
}

enum ViewTypes {
  VIEW_ONLY = 'viewOnly',
  ENTER_SCORES = 'enterScores',
}

export { DefaulSelectFalues, DayTypes, ViewTypes };
