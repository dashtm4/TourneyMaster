import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faCalendar,
  faSave,
} from '@fortawesome/free-regular-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {
  SectionDropdown,
  HeadingLevelThree,
  HeadingLevelFour,
  Tooltip,
  Button,
  Paper,
} from 'components/common';
import { stringToLink } from 'helpers';
import { EventMenuTitles } from 'common/enums';
import styles from '../styles.module.scss';

interface IProps {
  onEditScheduleDetails: () => void;
  onManageTournamentPlay: () => void;
  onSaveScheduleCSV: () => void;
}

export default (props: IProps) => {
  const {
    onEditScheduleDetails,
    onManageTournamentPlay,
    onSaveScheduleCSV,
  } = props;

  return (
    <SectionDropdown
      type="section"
      isDefaultExpanded={true}
      useBorder={true}
      id={stringToLink(EventMenuTitles.TOURNAMENT_PLAY)}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>
          {EventMenuTitles.TOURNAMENT_PLAY}
        </span>
      </HeadingLevelThree>
      <div className={styles.tournamentPlay}>
        <Paper padding={20}>
          <div className={styles.header}>
            <HeadingLevelFour>
              <span>Men's Spring Thaw (2020, 2021)</span>
            </HeadingLevelFour>
            <Button
              icon={<FontAwesomeIcon icon={faEdit} />}
              label="Edit Schedule Details"
              color="secondary"
              variant="text"
              onClick={onEditScheduleDetails}
            />
          </div>
          <div className={styles.tournamentName}>
            <div className={styles.tnFirst}>
              <div className={styles.sectionCellHor}>
                <span>Teams:</span>
                <p>24</p>
              </div>
              <Button
                icon={<FontAwesomeIcon icon={faCalendar} />}
                label="Manage Tournament Play"
                color="secondary"
                variant="text"
                onClick={onManageTournamentPlay}
              />
            </div>
            <div className={styles.tnSecond}>
              <div className={styles.sectionCellHor}>
                <span>Dates:</span>
                <p>02/08/20 - 02/09/20</p>
              </div>
            </div>
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
              <Button
                icon={<FontAwesomeIcon icon={faSave} />}
                label="Save Schedule to CSV"
                color="secondary"
                variant="text"
                onClick={onSaveScheduleCSV}
              />
            </div>
          </div>
        </Paper>
      </div>
    </SectionDropdown>
  );
};
