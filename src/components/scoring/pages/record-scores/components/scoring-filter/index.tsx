import React from 'react';
import { Button, Select, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/Types';
import styles from './styles.module.scss';

const CARD_MESSAGE_STYLES = {
  maxWidth: '215px',
};

interface Props {
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
}

const ScoringFilter = ({
  selectedDivision,
  selectedTeam,
  selectedField,
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
      <Select options={[{ label: 'All', value: 'all' }]} value={selectedDivision} />
    </fieldset>
    <fieldset className={styles.selectWrapper}>
      <legend className={styles.selectTitle}>Teams</legend>
      <Select options={[{ label: 'All', value: 'all' }]} value={selectedTeam} />
    </fieldset>
    <fieldset className={styles.selectWrapper}>
      <legend className={styles.selectTitle}>Fields</legend>
      <Select options={[{ label: 'All', value: 'all' }]} value={selectedField} />
    </fieldset>
    <CardMessage type={CardMessageTypes.INFO} style={CARD_MESSAGE_STYLES}>
      Drag, drop, and zoom to navigate the schedule
    </CardMessage>
  </form>
);

export default ScoringFilter;
