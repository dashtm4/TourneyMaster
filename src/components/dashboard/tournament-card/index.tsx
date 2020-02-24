import React from 'react';
import { History } from 'history';
import Paper from '../../common/paper';
import styles from './style.module.scss';
import Button from '../../common/buttons/button';
import tournamentLogoExample from '../../../assets/tournamentLogoExample.svg';
import { getTournamentStatusColor } from '../../../helpers/getTournamentStatusColor';
import moment from 'moment';
import { EventDetailsDTO } from 'components/event-details/logic/model';

interface ITournamentCardProps {
  event: EventDetailsDTO;
  history: History;
}

const TournamentCard = ({ event, history }: ITournamentCardProps) => {
  const onTournamentManage = () => {
    history.push(`event/event-details/${event.event_id}`);
  };

  const startDate = moment(event.event_startdate).format('DD.MM.YYYY');
  const endDate = moment(event.event_enddate).format('DD.MM.YYYY');
  return (
    <div className={styles.tournamentContainer}>
      <Paper>
        <div className={styles.tournamentHeader}>
          <div className={styles.cardImage}>
            <img
              alt="logo"
              src={
                !event.event_logo_path || event.event_logo_path === 'logopath'
                  ? tournamentLogoExample
                  : event.event_logo_path
              }
            />
          </div>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {event.event_name || 'Undefined Event'}
            </h2>
            <div className={styles.additionalMessage}>
              {`${startDate} - ${endDate}`}
            </div>
          </div>
          <div className={styles.buttonsGroup}>
            <Button
              label="Manage"
              variant="contained"
              color="primary"
              onClick={onTournamentManage}
            />
            <Button label="Duplicate" variant="text" color="secondary" />
          </div>
        </div>
        <div className={styles.tournamentContent}>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>Teams:</span> {'—'}
          </div>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>Locations:</span>{' '}
            {event.num_of_locations || '—'}
          </div>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>Status:</span>{' '}
            {event.event_status || '—'}{' '}
            <span
              className={styles.tournamentStatus}
              style={{
                ...getTournamentStatusColor(event.event_status),
              }}
            />
          </div>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>Players:</span>{' '}
            {'—'}
          </div>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>Fields:</span> {'—'}
          </div>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>Schedule:</span>{' '}
            {'—'}
          </div>
        </div>
      </Paper>
    </div>
  );
};
export default TournamentCard;
