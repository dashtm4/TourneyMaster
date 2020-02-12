import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import ScoringItem from './components/scoring-Item';
import styles from './styles.module.scss';

const Sсoring = () => {
  return (
    <section>
      <p className={styles.navWrapper}>
        <Button label="Record Scores" variant="contained" color="primary" />
      </p>
      <div className={styles.headingWrapper}>
        <HeadingLevelTwo>Scoring</HeadingLevelTwo>
        <ul className={styles.scoringList}>
          <ScoringItem />
        </ul>
      </div>
    </section>
  );
};

export default Sсoring;
