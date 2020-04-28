import moment from 'moment';
import { DefaultSelectValues } from 'common/enums';
import { IEntity } from 'common/types';
import { ISelectOption } from 'common/models';

const getSelectOptions = (
  entities: IEntity[],
  valueKey: string,
  labelKey: string
): ISelectOption[] => {
  const selectOptions = entities.map(it => ({
    value: it[valueKey],
    label: it[labelKey],
  }));

  return selectOptions;
};

const getSelectDayOptions = (eventDays: string[]) => {
  const selectDayOptions = [
    {
      label: DefaultSelectValues.ALL,
      value: DefaultSelectValues.ALL,
    },
    ...eventDays.map(day => ({
      label: moment(day).format('l'),
      value: day,
    })),
  ];

  return selectDayOptions;
};

export { getSelectDayOptions, getSelectOptions };
