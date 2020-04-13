import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { HeadingLevelFour, Button, Paper } from 'components/common';
import { Routes } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface Props {
  schedule: ISchedulingSchedule;
  eventId: string;
}

const BraketsItem = ({ schedule, eventId }: Props) => (
  <li className={styles.brackets}>
    <Paper padding={20}>
      <div className={styles.header}>
        <HeadingLevelFour>
          <span>{schedule.schedule_name}</span>
        </HeadingLevelFour>
        <Link to={`${Routes.SCHEDULES}/${eventId}/${schedule.schedule_id}`}>
          <Button
            icon={<FontAwesomeIcon icon={faNetworkWired} />}
            label="Manage Bracket"
            color="secondary"
            variant="text"
          />
        </Link>
      </div>
      <div className={styles.tournamentName}>
        <p className={styles.textWrapper}>
          <b>Teams:</b>
          <span className={styles.textNameWrapper}>
            <span> {schedule.num_teams}</span>
          </span>
        </p>
      </div>
    </Paper>
  </li>
);

export default BraketsItem;
