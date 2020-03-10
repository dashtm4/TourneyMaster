import { IField } from 'common/models';

export interface IFieldWithRelated extends IField {
  relatedTo: string;
}

enum DefaulSelectFalues {
  ALL = 'all',
}

export { DefaulSelectFalues };
