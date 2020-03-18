import React from 'react';
import { orderBy } from 'lodash-es';
import { Button, Select, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { ButtonTypes, SortByFilesTypes } from 'common/enums';
import { IDivision, IEventSummary } from 'common/models';
import { DefaulSelectFalues } from '../../types';
import { DayTypes, IScheduleFilter } from '../../types';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';

const CARD_MESSAGE_STYLES = {
  maxWidth: '215px',
};

interface Props {
  divisions: IDivision[];
  teams: ITeamCard[];
  eventSummary: IEventSummary[];
  filterValues: IScheduleFilter;
  onChangeFilterValue: (values: IScheduleFilter) => void;
}

type inputType = React.ChangeEvent<HTMLInputElement>;

const ScoringFilter = (props: Props) => {
  const {
    divisions,
    teams,
    eventSummary,
    filterValues,
    onChangeFilterValue,
  } = props;

  const onDaySelect = (day: string) => {
    onChangeFilterValue({
      ...filterValues,
      selectedDay: DayTypes[day],
    });
  };

  const onDivisionSelect = (event: inputType) => {
    onChangeFilterValue({
      ...filterValues,
      selectedDivision: event.target.value,
    });
  };

  const onTeamsSelect = (event: inputType) => {
    onChangeFilterValue({
      ...filterValues,
      selectedTeam: event.target.value,
    });
  };

  const onFieldsSelect = (event: inputType) => {
    onChangeFilterValue({
      ...filterValues,
      selectedField: event.target.value,
    });
  };

  const divisionOptions = [
    { label: 'All', value: DefaulSelectFalues.ALL },
    ...orderBy(divisions, SortByFilesTypes.DIVISIONS).map(division => ({
      label: division[SortByFilesTypes.DIVISIONS],
      value: division.division_id,
    })),
  ];

  const teamsOptions = [
    { label: 'All', value: DefaulSelectFalues.ALL },
    ...orderBy(teams, 'divisionShortName').map(team => ({
      label: team.name,
      value: team.id,
    })),
  ];

  const fieldsOptions = [
    { label: 'All', value: DefaulSelectFalues.ALL },
    ...orderBy(eventSummary, SortByFilesTypes.FACILITIES_INITIALS).map(es => ({
      label: `${es[SortByFilesTypes.FACILITIES_INITIALS]} - ${es.field_name}`,
      value: es.field_id,
    })),
  ];

  return (
    <section>
      <h3 className="visually-hidden">Scoring filters</h3>
      <form className={styles.scoringForm}>
        {Object.keys(DayTypes).map(day => (
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
        <fieldset className={styles.selectWrapper}>
          <legend className={styles.selectTitle}>Division</legend>
          <Select
            onChange={onDivisionSelect}
            value={filterValues.selectedDivision}
            options={divisionOptions}
          />
        </fieldset>
        <fieldset className={styles.selectWrapper}>
          <legend className={styles.selectTitle}>Teams</legend>
          <Select
            onChange={onTeamsSelect}
            value={filterValues.selectedTeam}
            options={teamsOptions}
          />
        </fieldset>
        <fieldset className={styles.selectWrapper}>
          <legend className={styles.selectTitle}>Fields</legend>
          <Select
            onChange={onFieldsSelect}
            value={filterValues.selectedField}
            options={fieldsOptions}
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
};

export default ScoringFilter;
