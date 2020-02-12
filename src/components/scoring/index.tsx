import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import SectionDropdown from '../common/section-dropdown';
import Button from '../common/buttons/button';
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
          <li>
            <SectionDropdown>
              <span>Men’s Spring Thaw (Division: 2020, 2021)</span>
              <p>content</p>
            </SectionDropdown>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Sсoring;
