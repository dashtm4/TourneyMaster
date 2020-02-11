import React from 'react';
import styles from '../styles.module.scss';

const TeamsAthletesInfo = ({ data }: any) => (
  <div className={styles.section}>
    <div className={styles.sectionFirstRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Max Teams Per Division</span>
        <p>{data.maxTeamsPerDiv || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Min Athletes on Roster</span>
        <p>{data.minOnRoster || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Max Athletes on Roster</span>
        <p>{data.maxOnRoster || '—'}</p>
      </div>
    </div>
    <div className={styles.sectionSecondRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Athlete Birth Date</span>
        <p>{data.athleteBirth}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Athlete Jersey Number</span>
        <p>{data.athleteJersey}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Athlete Email</span>
        <p>{data.athleteEmail}</p>
      </div>
    </div>
  </div>
);

export default TeamsAthletesInfo;
