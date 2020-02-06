import React from 'react';
import styles from '../styles.module.scss';

const TeamsAthletesInfo = ({ data }: any) => (
  <div className={styles.section}>
    <div className={styles['section-first-row']}>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Max Teams Per Division</span>
        <p>{data.maxTeamsPerDiv || '—'}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Min Athletes on Roster</span>
        <p>{data.minOnRoster || '—'}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Max Athletes on Roster</span>
        <p>{data.maxOnRoster || '—'}</p>
      </div>
    </div>
    <div className={styles['section-second-row']}>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Athlete Birth Date</span>
        <p>{data.athleteBirth}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Athlete Jersey Number</span>
        <p>{data.athleteJersey}</p>
      </div>
      <div className={styles['section-item']}>
        <span className={styles['section-title']}>Athlete Email</span>
        <p>{data.athleteEmail}</p>
      </div>
    </div>
  </div>
);

export default TeamsAthletesInfo;
