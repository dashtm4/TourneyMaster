import React from 'react';
import styles from './styles.module.scss';
import { IDivision } from 'common/models/divisions';

interface IDivisionDetailProps {
  data: IDivision;
}

const DivisionDetails = ({ data }: IDivisionDetailProps) => (
  <div className={styles.divisionDetailsContainer}>
    <div className={styles.divisionItem}>
      <span className={styles.divisionTitle}>Max Team Registration:</span>{' '}
      {data.max_num_teams || '—'}
    </div>
    <div className={styles.divisionItem}>
      <span className={styles.divisionTitle}>Teams Paid:</span>{' '}
      {/* {data.teams_paid || '—'} */}
    </div>
    <div className={styles.divisionItem}>
      <span className={styles.divisionTitle}>Entry Fee:</span>{' '}
      {(data.entry_fee && `$${data.entry_fee}`) || '—'}
    </div>
    <div className={styles.divisionItem}>
      <span className={styles.divisionTitle}>Teams Registered:</span>{' '}
      {data.teams_registered || '—'}
    </div>
    <div className={styles.divisionItem}>
      <span className={styles.divisionTitle}>Teams Tentetive:</span>{' '}
      {data.teams_tentitive || '—'}
    </div>
    <div className={styles.divisionItem}>
      <span className={styles.divisionTitle}>Number of Pools:</span>{' '}
      {data.num_pools || '—'}
    </div>
  </div>
);

export default DivisionDetails;
