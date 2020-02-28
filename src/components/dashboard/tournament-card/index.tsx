import React from 'react';
import { History } from 'history';
import Paper from '../../common/paper';
import styles from './style.module.scss';
import Button from '../../common/buttons/button';
import tournamentLogoExample from '../../../assets/tournamentLogoExample.svg';
import { getTournamentStatusColor } from '../../../helpers/getTournamentStatusColor';
import moment from 'moment';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ITournamentCardProps {
  event: EventDetailsDTO;
  numOfTeams: number;
  numOfFields: number;
  isDetailLoading: boolean;
  history: History;
}

const TournamentCard = ({
  event,
  history,
  isDetailLoading,
  numOfTeams,
  numOfFields,
}: ITournamentCardProps) => {
  const onTournamentManage = () => {
    history.push(`event/event-details/${event.event_id}`);
  };

  const startDate = moment(event.event_startdate).format('MM.DD.YYYY');
  const endDate = moment(event.event_enddate).format('MM.DD.YYYY');
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
            <span className={styles.tournamentContentTitle}>Teams:</span>{' '}
            {!isDetailLoading ? (
              numOfTeams || '—'
            ) : (
              <CircularProgress size={15} />
            )}
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
            <span className={styles.tournamentContentTitle}>Fields:</span>{' '}
            {!isDetailLoading ? (
              numOfFields || '—'
            ) : (
              <CircularProgress size={15} />
            )}
          </div>
          <div className={styles.tournamentContentItem}>
            <span className={styles.tournamentContentTitle}>
              Last Schedule Release:
            </span>{' '}
            {'—'}
          </div>
        </div>
      </Paper>
    </div>
  );
};
export default TournamentCard;
