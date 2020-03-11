import React from 'react';
import { Button, Select, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { ISelectOption } from 'components/common/select';
import { sortByField } from 'helpers';
import { ButtonTypes, SortByFilesTypes } from 'common/enums';
import { IDivision, ITeam } from 'common/models';
import { DefaulSelectFalues, IFieldWithRelated, DayTypes } from '../../types';
import styles from './styles.module.scss';

const CARD_MESSAGE_STYLES = {
  maxWidth: '215px',
};

enum FormFields {
  SELECTED_DIVISION = 'selectedDivision',
  SELECTED_TEAM = 'selectedTeam',
  SELECTED_FIELDS = 'selectedField',
}

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  fields: IFieldWithRelated[];
  selectedDay: DayTypes;
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
  onChangeSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDay: (day: DayTypes) => void;
}

const ScoringFilter = ({
  divisions,
  teams,
  fields,
  selectedDay,
  selectedDivision,
  selectedTeam,
  selectedField,
  onChangeSelect,
  onChangeDay,
}: Props) => (
  <section>
    <h3 className="visually-hidden">Scoring filters</h3>
    <form className={styles.scoringForm}>
      {Object.keys(DayTypes).map(it => (
        <Button
          onClick={() => onChangeDay(DayTypes[it])}
          label={DayTypes[it]}
          variant="contained"
          color="primary"
          type={
            selectedDay === DayTypes[it]
              ? ButtonTypes.SQUARED
              : ButtonTypes.SQUARED_OUTLINED
          }
          key={it}
        />
      ))}
      <fieldset className={styles.selectWrapper}>
        <legend className={styles.selectTitle}>Division</legend>
        <Select
          onChange={onChangeSelect}
          value={selectedDivision}
          name={FormFields.SELECTED_DIVISION}
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
          onChange={onChangeSelect}
          value={selectedTeam}
          name={FormFields.SELECTED_TEAM}
          options={[
            { label: 'All', value: DefaulSelectFalues.ALL },
            ...sortByField(teams, SortByFilesTypes.TEAMS).reduce(
              (acc, it) =>
                it.division_id === selectedDivision ||
                selectedDivision === DefaulSelectFalues.ALL
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
          onChange={onChangeSelect}
          value={selectedField}
          name={FormFields.SELECTED_FIELDS}
          options={[
            { label: 'All', value: DefaulSelectFalues.ALL },
            ...sortByField(fields, SortByFilesTypes.RELATED_FIELDS).map(
              it =>
                ({
                  label: `${it.relatedTo} - ${it.field_name}`,
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
