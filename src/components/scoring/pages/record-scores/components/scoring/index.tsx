import React from 'react';
import ScoringFilter from '../scoring-filter/index';
import { DayTypes } from '../../index';
import styles from './styles.module.scss';

interface Props {
  selectedDay: DayTypes;
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
  onChangeSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDay: (day: DayTypes) => void;
}

const Scoring = ({
  selectedDay,
  selectedDivision,
  selectedTeam,
  selectedField,
  onChangeSelect,
  onChangeDay,
}: Props) => (
  <section className={styles.scoringWrapper}>
    <h2 className="visually-hidden">Scoring</h2>
    <ScoringFilter
      selectedDay={selectedDay}
      selectedDivision={selectedDivision}
      selectedTeam={selectedTeam}
      selectedField={selectedField}
      onChangeSelect={onChangeSelect}
      onChangeDay={onChangeDay}
    />
  </section>
);

export default Scoring;
