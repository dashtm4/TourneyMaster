import React from 'react';
import Paper from '../../common/paper';
import styles from './style.module.scss';
import Button from '../../common/buttons/button';

const TournamentCard = ({ data }: any) => (
  <Paper>
    <div className={styles['tournament-header']}>
      <div className={styles['card-image']}>
        <img src={data.logo} />
      </div>
      <div className={styles['card-header']}>
        <h2 className={styles['card-title']}>{data.title}</h2>
        <div className={styles['additional-message']}>{data.date}</div>
      </div>
      <div className={styles['buttons-group']}>
        <Button label="Manage" variant="contained" color="primary" />
        <Button label="Duplicate" variant="text" color="secondary" />
      </div>
    </div>
    <div className={styles['tournament-content']}>
      <div className={styles['tournament-content-item']}>
        <span className={styles['tournament-content-title']}>Teams RSVP:</span>{' '}
        {data.teamsRsvp}
      </div>
      <div className={styles['tournament-content-item']}>
        <span className={styles['tournament-content-title']}>Locations:</span>{' '}
        {data.locations}
      </div>
      <div className={styles['tournament-content-item']}>
        <span className={styles['tournament-content-title']}>Status:</span>{' '}
        {data.status}
      </div>
      <div className={styles['tournament-content-item']}>
        <span className={styles['tournament-content-title']}>Players:</span>{' '}
        {data.players}
      </div>
      <div className={styles['tournament-content-item']}>
        <span className={styles['tournament-content-title']}>Fields:</span>{' '}
        {data.fields}
      </div>
      <div className={styles['tournament-content-item']}>
        <span className={styles['tournament-content-title']}>Schedule:</span>{' '}
        {data.schedule}
      </div>
    </div>
  </Paper>
);

export default TournamentCard;
