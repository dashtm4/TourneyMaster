import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { HeadingLevelFour, Tooltip, Button, Paper } from 'components/common';
import { BindingCbWithOne } from 'common/models';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';
import { Routes } from 'common/enums';
import { getTournamentStatusColor } from 'helpers/getTournamentStatusColor';

const DEFAULT_UPDATED_VALUE = 'Not updated yet.';

interface IProps {
  schedule: ISchedulingSchedule;
  eventId: string;
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
}

const TournamentPlayItem = ({ schedule, eventId, onEditSchedule }: IProps) => {
  const localOnEditSchedule = () => onEditSchedule(schedule);

  return (
    <li className={styles.tournamentPlay}>
      <Paper padding={20}>
        <div className={styles.header}>
          <HeadingLevelFour>
            <span>{schedule.schedule_name}</span>
          </HeadingLevelFour>
        </div>
        <p className={styles.textWrapper}>
          <b>Status:</b> <span>{schedule.schedule_status || '—'}</span>{' '}
          <span
            className={styles.scheduleStatus}
            style={{
              ...getTournamentStatusColor(schedule.schedule_status),
            }}
          />
        </p>
        <p className={styles.textWrapper}>
          <b>Created by:</b>
          <span className={styles.textNameWrapper}>
            <span> {schedule.createdByName}</span>
            <span>{moment(schedule.created_datetime).format('LLL')}</span>
          </span>
        </p>
        <p className={styles.textWrapper}>
          <b>Last Updated By:</b>
          <span className={styles.textNameWrapper}>
            {schedule.updated_by ? (
              <>
                <span>{schedule.updatedByName}</span>
                <span>{moment(schedule.updated_datetime).format('LLL')}</span>
              </>
            ) : (
              DEFAULT_UPDATED_VALUE
            )}
          </span>
        </p>
        <div className={styles.btnsWrapper}>
          <Button
            icon={<FontAwesomeIcon icon={faEdit} />}
            label="Edit Schedule Details"
            color="secondary"
            variant="text"
            onClick={localOnEditSchedule}
          />
          <Link to={`${Routes.SCHEDULES}/${eventId}/${schedule.schedule_id}`}>
            <Button
              icon={<FontAwesomeIcon icon={faCalendar} />}
              label="Manage Tournament Play"
              color="secondary"
              variant="text"
            />
          </Link>
        </div>
        {false && (
          <div className={styles.tnThird}>
            <Tooltip
              type="warning"
              title="TRUE Florida (2020, 2021) cannot play 10:00 AM - 12:00 PM"
            >
              <div className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <span>Schedule Requires Revisions</span>
              </div>
            </Tooltip>
          </div>
        )}
      </Paper>
    </li>
  );
};

export default TournamentPlayItem;
