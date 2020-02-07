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
    history.push(`/event-details/${event.event_id}`);
  };

  return (
    <div className={styles['tournament-container']}>
      <Paper>
        <div className={styles['tournament-header']}>
          <div className={styles['card-image']}>
            <img
              src={
                event.event_logo_path === 'logopath'
                  ? tournamentLogoExample
                  : event.event_logo_path
              }
            />
          </div>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']}>{event.event_name}</h2>
            <div className={styles['additional-message']}>
              {moment(event.event_startdate).format('DD.MM.YYYY')} -{' '}
              {moment(event.event_enddate).format('DD.MM.YYYY')}
            </div>
          </div>
          <div className={styles['buttons-group']}>
            <Button
              label="Manage"
              variant="contained"
              color="primary"
              onClick={onTournamentManage}
            />
            <Button label="Duplicate" variant="text" color="secondary" />
          </div>
        </div>
        <div className={styles['tournament-content']}>
          <div className={styles['tournament-content-item']}>
            <span className={styles['tournament-content-title']}>Teams:</span>{' '}
          </div>
          <div className={styles['tournament-content-item']}>
            <span className={styles['tournament-content-title']}>
              Locations:
            </span>{' '}
            {event.num_of_locations}
          </div>
          <div className={styles['tournament-content-item']}>
            <span className={styles['tournament-content-title']}>Status:</span>{' '}
            {event.event_status || '—'}{' '}
            <span
              className={styles['tournament-status']}
              style={
                event.event_status && {
                  ...getTournamentStatusColor(event.event_status),
                }
              }
            />
          </div>
          <div className={styles['tournament-content-item']}>
            <span className={styles['tournament-content-title']}>Players:</span>{' '}
          </div>
          <div className={styles['tournament-content-item']}>
            <span className={styles['tournament-content-title']}>Fields:</span>{' '}
          </div>
          <div className={styles['tournament-content-item']}>
            <span className={styles['tournament-content-title']}>
              Schedule:
            </span>{' '}
          </div>
        </div>
      </Paper>
    </div>
  );
};
export default TournamentCard;
