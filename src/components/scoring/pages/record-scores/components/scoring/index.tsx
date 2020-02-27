import React from 'react';
import ScoringFilter from '../scoring-filter/index';
import styles from './styles.module.scss';

interface Props {
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
}

const Scoring = ({ selectedDivision, selectedTeam, selectedField }: Props) => (
  <section className={styles.scoringWrapper}>
    <h2 className="visually-hidden">Scoring</h2>
    <ScoringFilter
      selectedDivision={selectedDivision}
      selectedTeam={selectedTeam}
      selectedField={selectedField}
    />
  </section>
);

export default Scoring;
