import React from 'react';
import ScoringFilter from '../scoring-filter/index';
import { DayTypes } from '../../index';
import styles from './styles.module.scss';

interface Props {
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
  onChangeSelect: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDay: (day: DayTypes) => void;
}

const Scoring = ({
  selectedDivision,
  selectedTeam,
  selectedField,
  onChangeSelect,
}: Props) => (
  <section className={styles.scoringWrapper}>
    <h2 className="visually-hidden">Scoring</h2>
    <ScoringFilter
      selectedDivision={selectedDivision}
      selectedTeam={selectedTeam}
      selectedField={selectedField}
      onChangeSelect={onChangeSelect}
    />
  </section>
);

export default Scoring;
