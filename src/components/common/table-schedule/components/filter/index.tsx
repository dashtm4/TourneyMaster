import React from 'react';
import { Button, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { ButtonTypes } from 'common/enums';
import { IDivision, IEventSummary } from 'common/models';
import { DayTypes, IScheduleFilter } from '../../types';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import MultipleSearchSelect from 'components/common/multiple-search-select';
import {
  selectDivisionsFilter,
  selectTeamsFilter,
  selectFieldsFilter,
} from '../../helpers';

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

  const onDivisionSelect = (_event: any, value: any) => {
    onChangeFilterValue({
      ...filterValues,
      selectedDivisions: [...value],
    });
  };

  const onTeamsSelect = (_event: any, value: any) => {
    onChangeFilterValue({
      ...filterValues,
      selectedTeams: [...value],
    });
  };

  const onFieldsSelect = (_event: inputType, value: any) => {
    onChangeFilterValue({
      ...filterValues,
      selectedFields: [...value],
    });
  };

  const divisionOptions = selectDivisionsFilter(divisions);

  const teamsOptions = selectTeamsFilter(teams);

  const fieldsOptions = selectFieldsFilter(eventSummary);

  return (
    <section>
      <h3 className="visually-hidden">Scoring filters</h3>
      <form className={styles.scoringForm}>
        <div className={styles.buttonsWrapper}>
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
        </div>
        <fieldset className={styles.selectWrapper}>
          <legend className={styles.selectTitle}>Division</legend>
          <MultipleSearchSelect
            width="170px"
            placeholder="Select"
            options={divisionOptions}
            onChange={onDivisionSelect}
            value={filterValues.selectedDivisions}
          />
        </fieldset>
        <fieldset className={styles.selectWrapper}>
          <legend className={styles.selectTitle}>Teams</legend>
          <MultipleSearchSelect
            width="170px"
            placeholder="Select"
            options={teamsOptions}
            onChange={onTeamsSelect}
            value={filterValues.selectedTeams}
          />
        </fieldset>
        <fieldset className={styles.selectWrapper}>
          <legend className={styles.selectTitle}>Fields</legend>
          <MultipleSearchSelect
            width="170px"
            placeholder="Select"
            options={fieldsOptions}
            onChange={onFieldsSelect}
            value={filterValues.selectedFields}
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
