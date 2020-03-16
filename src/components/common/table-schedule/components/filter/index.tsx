import React from 'react';
import { Button, Select, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { ISelectOption } from 'components/common/select';
import { sortByField } from 'helpers';
import { ButtonTypes, SortByFilesTypes } from 'common/enums';
import { IDivision, ITeam, IEventSummary } from 'common/models';
import { DefaulSelectFalues } from '../../types';
import { DayTypes, IScheduleFilter } from '../../types';
import styles from './styles.module.scss';

const CARD_MESSAGE_STYLES = {
  maxWidth: '215px',
};

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  eventSummary: IEventSummary[];
  filterValues: IScheduleFilter;
  onChangeFilterValue: (values: IScheduleFilter) => void;
}

type inputType = React.ChangeEvent<HTMLInputElement>;

const ScoringFilter = ({
  divisions,
  teams,
  eventSummary,
  filterValues,
  onChangeFilterValue,
}: Props) => (
  <section>
    <h3 className="visually-hidden">Scoring filters</h3>
    <form className={styles.scoringForm}>
      {Object.keys(DayTypes).map(it => (
        <Button
          onClick={() =>
            onChangeFilterValue({ ...filterValues, selectedDay: DayTypes[it] })
          }
          label={DayTypes[it]}
          variant="contained"
          color="primary"
          type={
            filterValues.selectedDay === DayTypes[it]
              ? ButtonTypes.SQUARED
              : ButtonTypes.SQUARED_OUTLINED
          }
          key={it}
        />
      ))}
      <fieldset className={styles.selectWrapper}>
        <legend className={styles.selectTitle}>Division</legend>
        <Select
          onChange={(evt: inputType) =>
            onChangeFilterValue({
              ...filterValues,
              selectedDivision: evt.target.value,
            })
          }
          value={filterValues.selectedDivision}
          options={[
            { label: 'All', value: DefaulSelectFalues.ALL },
            ...sortByField(divisions, SortByFilesTypes.DIVISIONS).map(it => ({
              label: it.short_name,
              value: it.division_id,
            })),
          ]}
        />
      </fieldset>
      <fieldset className={styles.selectWrapper}>
        <legend className={styles.selectTitle}>Teams</legend>
        <Select
          onChange={(evt: inputType) =>
            onChangeFilterValue({
              ...filterValues,
              selectedTeam: evt.target.value,
            })
          }
          value={filterValues.selectedTeam}
          options={[
            { label: 'All', value: DefaulSelectFalues.ALL },
            ...sortByField(teams, SortByFilesTypes.TEAMS).reduce(
              (acc, it) =>
                it.division_id === filterValues.selectedDivision ||
                filterValues.selectedDivision === DefaulSelectFalues.ALL
                  ? [
                      ...acc,
                      {
                        label: it.short_name,
                        value: it.team_id,
                      } as ISelectOption,
                    ]
                  : acc,
              [] as ISelectOption[]
            ),
          ]}
        />
      </fieldset>
      <fieldset className={styles.selectWrapper}>
        <legend className={styles.selectTitle}>Fields</legend>
        <Select
          onChange={(evt: inputType) =>
            onChangeFilterValue({
              ...filterValues,
              selectedField: evt.target.value,
            })
          }
          value={filterValues.selectedField}
          options={[
            { label: 'All', value: DefaulSelectFalues.ALL },
            ...sortByField(
              eventSummary,
              SortByFilesTypes.FACILITIES_INITIALS
            ).map(
              it =>
                ({
                  label: `${it.facilities_initials} - ${it.field_name}`,
                  value: it.field_id,
                } as ISelectOption)
            ),
          ]}
        />
      </fieldset>
      <CardMessage
        type={CardMessageTypes.EMODJI_OBJECTS}
        style={CARD_MESSAGE_STYLES}
      >
        Drag, drop, and zoom to navigate the schedule
      </CardMessage>
    </form>
  </section>
);
export default ScoringFilter;
