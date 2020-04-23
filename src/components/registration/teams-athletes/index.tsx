import React from 'react';
import styles from '../styles.module.scss';

enum Options {
  'Require' = 1,
  'Request' = 2,
  'None' = 0,
}

const TeamsAthletesInfo = ({ data, eventType }: any) => (
  <div className={styles.section}>
    <div className={styles.taSectionFirstRow}>
      <div className={styles.sectionItem}>
        {eventType === 'Showcase' ? (
          <>
            <span className={styles.sectionTitle}>
              Max Players Per Division
            </span>
            <p>{data.max_players_per_division || '—'}</p>
          </>
        ) : (
          <>
            <span className={styles.sectionTitle}>Max Teams Per Division</span>
            <p>{data.max_teams_per_division || '—'}</p>
          </>
        )}
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Min Athletes on Roster</span>
        <p>{data.min_players_per_roster || '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Max Athletes on Roster</span>
        <p>{data.max_players_per_roster || '—'}</p>
      </div>
    </div>
    <div className={styles.taSectionSecondRow}>
      <div className={styles.taSectionItem}>
        <span className={styles.sectionTitle}>Athlete Birth Date</span>
        <p>{Options[data.request_athlete_birthdate] || '—'}</p>
      </div>
      <div className={styles.taSectionItem}>
        <span className={styles.sectionTitle}>Athlete Jersey Number</span>
        <p>{Options[data.request_athlete_jersey_number] || '—'}</p>
      </div>
      <div className={styles.taSectionItem}>
        <span className={styles.sectionTitle}>Athlete Email</span>
        <p>{Options[data.request_athlete_email] || '—'}</p>
      </div>
    </div>
  </div>
);

export default TeamsAthletesInfo;
