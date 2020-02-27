import React from 'react';
import { Button, Select, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/Types';
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
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
  onChangeSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const ScoringFilter = ({
  selectedDivision,
  selectedTeam,
  selectedField,
  onChangeSelect,
}: Props) => (
  <form className={styles.scoringForm}>
    <h3 className="visually-hidden">Scoring filters</h3>
    <Button
      label="Day 1"
      variant="contained"
      color="primary"
      type="squaredOutlined"
    />
    <Button
      label="Day 2"
      variant="contained"
      color="primary"
      type="squaredOutlined"
    />
    <Button
      label="Day 3"
      variant="contained"
      color="primary"
      type="squaredOutlined"
    />
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
