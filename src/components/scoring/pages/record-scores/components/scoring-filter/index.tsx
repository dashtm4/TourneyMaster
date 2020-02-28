import React from 'react';
import { Button, Select, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/Types';
import { DayTypes } from '../../index';
import { ButtonTypes } from 'common/enums';
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
  selectedDay: DayTypes;
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
  onChangeSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDay: (day: DayTypes) => void;
}

const ScoringFilter = ({
  selectedDay,
  selectedDivision,
  selectedTeam,
  selectedField,
  onChangeSelect,
  onChangeDay,
}: Props) => (
  <form className={styles.scoringForm}>
    <h3 className="visually-hidden">Scoring filters</h3>
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
        options={[{ label: 'All', value: 'all' }]}
      />
    </fieldset>
    <fieldset className={styles.selectWrapper}>
      <legend className={styles.selectTitle}>Teams</legend>
      <Select
        onChange={onChangeSelect}
        value={selectedTeam}
        name={FormFields.SELECTED_TEAM}
        options={[{ label: 'All', value: 'all' }]}
      />
    </fieldset>
    <fieldset className={styles.selectWrapper}>
      <legend className={styles.selectTitle}>Fields</legend>
      <Select
        onChange={onChangeSelect}
        value={selectedField}
        name={FormFields.SELECTED_FIELDS}
        options={[{ label: 'All', value: 'all' }]}
      />
    </fieldset>
    <CardMessage type={CardMessageTypes.INFO} style={CARD_MESSAGE_STYLES}>
      Drag, drop, and zoom to navigate the schedule
    </CardMessage>
  </form>
);

export default ScoringFilter;
