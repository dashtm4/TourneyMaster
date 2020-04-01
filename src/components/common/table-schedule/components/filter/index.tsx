import React from 'react';
import { Button } from 'components/common';
import { ButtonTypes } from 'common/enums';
import { DayTypes, IScheduleFilter } from '../../types';
import styles from './styles.module.scss';
import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';

interface IProps {
  filterValues: IScheduleFilter;
  onChangeFilterValue: (values: IScheduleFilter) => void;
}

const ScoringFilter = (props: IProps) => {
  const { filterValues, onChangeFilterValue } = props;

  const {
    divisionsOptions,
    poolsOptions,
    teamsOptions,
    fieldsOptions,
  } = filterValues;

  const onDaySelect = (day: string) => {
    onChangeFilterValue({
      ...filterValues,
      selectedDay: DayTypes[day],
    });
  };

  const onSelectUpdate = (name: string, options: IMultiSelectOption[]) => {
    onChangeFilterValue({
      ...filterValues,
      [name]: options,
    });
  };

  return (
    <section>
      <h3 className="visually-hidden">Scoring filters</h3>
      <form className={styles.scoringForm}>
        <div className={styles.buttonsWrapper}>
          {Object.keys([]).map(day => (
            <Button
              onClick={() => onDaySelect(day)}
              label={DayTypes[day]}
              variant="contained"
              color="primary"
              type={
                filterValues.selectedDay === DayTypes[day]
                  ? ButtonTypes.SQUARED
                  : ButtonTypes.SQUARED_OUTLINED
              }
              key={day}
            />
          ))}
        </div>
        <div className={styles.selectsContainer}>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Divisions</legend>
            <MultiSelect
              name="divisionsOptions"
              selectOptions={divisionsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Pools</legend>
            <MultiSelect
              name="poolsOptions"
              selectOptions={poolsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Teams</legend>
            <MultiSelect
              name="teamsOptions"
              selectOptions={teamsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Fields</legend>
            <MultiSelect
              name="fieldsOptions"
              selectOptions={fieldsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
        </div>
      </form>
    </section>
  );
};

export default ScoringFilter;
