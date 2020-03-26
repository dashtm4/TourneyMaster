import React, { useState } from 'react';
import { Button, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { ButtonTypes } from 'common/enums';
import { IDivision, IEventSummary, IPool } from 'common/models';
import { DayTypes, IScheduleFilter } from '../../types';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import MultipleSearchSelect from 'components/common/multiple-search-select';
import {
  selectDivisionsFilter,
  selectPoolsFilter,
  selectTeamsFilter,
  selectFieldsFilter,
} from '../../helpers';

const CARD_MESSAGE_STYLES = {
  maxWidth: '250px',
};

interface IProps {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeamCard[];
  eventSummary: IEventSummary[];
  filterValues: IScheduleFilter;
  onChangeFilterValue: (values: IScheduleFilter) => void;
}

type inputType = React.ChangeEvent<HTMLInputElement>;

const ScoringFilter = (props: IProps) => {
  const {
    divisions,
    pools,
    teams,
    eventSummary,
    filterValues,
    onChangeFilterValue,
  } = props;

  const [divisionsInput, onDivisionsInputChange] = useState(null);
  const [poolsInput, onPoolsInputChange] = useState(null);
  const [teamsInput, onTeamsInputChange] = useState(null);
  const [fieldsInput, onFieldsInputChange] = useState(null);

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

  const onPoolsSelect = (_event: any, value: any) => {
    onChangeFilterValue({
      ...filterValues,
      selectedPools: [...value],
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

  const onDivisionsKeyDown = (event: any) =>
    onKeyDown('divisions', event?.keyCode);
  const onPoolsKeyDown = (event: any) => onKeyDown('pools', event?.keyCode);
  const onTeamsKeyDown = (event: any) => onKeyDown('teams', event?.keyCode);
  const onFieldsKeyDown = (event: any) => onKeyDown('fields', event?.keyCode);

  const divisionOptions = selectDivisionsFilter(divisions);
  const poolsOptions = selectPoolsFilter(pools);
  const teamsOptions = selectTeamsFilter(teams);
  const fieldsOptions = selectFieldsFilter(eventSummary);

  const onKeyDown = (name: string, keyCode: number) => {
    if (keyCode !== 13) return;
    let options;
    let selected: string;
    let input: string | null;

    switch (name) {
      case 'divisions':
        {
          input = divisionsInput;
          selected = 'selectedDivisions';
          options = divisionOptions;
        }
        break;
      case 'pools':
        {
          input = poolsInput;
          selected = 'selectedPools';
          options = poolsOptions;
        }
        break;
      case 'teams':
        {
          input = teamsInput;
          selected = 'selectedTeams';
          options = teamsOptions;
        }
        break;
      case 'fields':
        {
          input = fieldsInput;
          selected = 'selectedFields';
          options = fieldsOptions;
        }
        break;
    }

    console.log('options', options);
    const values = options?.filter(option =>
      option.label.toLowerCase().includes(input!)
    );

    console.log(
      'ON KEY DOWN',
      name,
      keyCode,
      input!,
      selected!,
      options,
      values
    );

    onChangeFilterValue({
      ...filterValues,
      [selected!]: values,
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
            <MultipleSearchSelect
              width="170px"
              placeholder="Select"
              options={divisionOptions}
              onChange={onDivisionSelect}
              value={filterValues.selectedDivisions}
              onKeyDown={onDivisionsKeyDown}
              onInputChange={(e: any) =>
                onDivisionsInputChange(e?.target?.value)
              }
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Pools</legend>
            <MultipleSearchSelect
              width="170px"
              placeholder="Select"
              options={poolsOptions}
              onChange={onPoolsSelect}
              value={filterValues.selectedPools}
              onKeyDown={onPoolsKeyDown}
              onInputChange={(e: any) => onPoolsInputChange(e?.target?.value)}
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
              onKeyDown={onTeamsKeyDown}
              onInputChange={(e: any) => onTeamsInputChange(e?.target?.value)}
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
              onKeyDown={onFieldsKeyDown}
              onInputChange={(e: any) => onFieldsInputChange(e?.target?.value)}
            />
          </fieldset>
        </div>
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
