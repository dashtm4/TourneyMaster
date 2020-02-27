import React from 'react';
import ScoringFilter from '../scoring-filter/index';
import styles from './styles.module.scss';

const Scoring = () => (
  <section className={styles.scoringWrapper}>
    <h2 className="visually-hidden">Scoring</h2>
    <ScoringFilter />
  </section>
);

export default Scoring;
