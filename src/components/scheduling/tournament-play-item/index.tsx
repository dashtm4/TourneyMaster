import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { HeadingLevelFour, Tooltip, Button, Paper } from 'components/common';
import { BindingAction } from 'common/models';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface IProps {
  schedule: ISchedulingSchedule;
  onEditScheduleDetails: BindingAction;
  onManageTournamentPlay: BindingAction;
}

const TournamentPlayItem = ({
  schedule,
  onEditScheduleDetails,
  onManageTournamentPlay,
}: IProps) => (
  <li className={styles.tournamentPlay}>
    <Paper padding={20}>
      <div className={styles.header}>
        <HeadingLevelFour>
          <span>{schedule.schedule_name}</span>
        </HeadingLevelFour>
      </div>
      {schedule.created_by && (
        <p className={styles.textWrapper}>
          <b>Created by: </b>
          {`${schedule.createdByName}(${moment(
            schedule.created_datetime
          ).format('L')})`}
        </p>
      )}
      {schedule.updated_by && (
        <p className={styles.textWrapper}>
          <b>Updated by: </b>
          {`${schedule.updatedByName}(${moment(schedule.updated_by).format(
            'L'
          )})`}
        </p>
      )}
      <div className={styles.btnsWrapper}>
        <Button
          icon={<FontAwesomeIcon icon={faEdit} />}
          label="Edit Schedule Details"
          color="secondary"
          variant="text"
          onClick={onEditScheduleDetails}
        />
        <Button
          icon={<FontAwesomeIcon icon={faCalendar} />}
          label="Manage Tournament Play"
          color="secondary"
          variant="text"
          onClick={onManageTournamentPlay}
        />
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

export default TournamentPlayItem;
