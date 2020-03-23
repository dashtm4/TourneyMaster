import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import { sortByField } from 'helpers';
import { BindingAction } from 'common/models';
import { EventMenuTitles, SortByFilesTypes } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface IProps {
  schedules: ISchedulingSchedule[];
  onEditScheduleDetails: BindingAction;
  onManageTournamentPlay: BindingAction;
}

export default (props: IProps) => {
  const { schedules, onEditScheduleDetails, onManageTournamentPlay } = props;
  const sortedScheduleByName = sortByField(
    schedules,
    SortByFilesTypes.SCHEDULES
  );

  return (
    <SectionDropdown
      type="section"
      isDefaultExpanded={true}
      useBorder={true}
      id={EventMenuTitles.TOURNAMENT_PLAY}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>
          {EventMenuTitles.TOURNAMENT_PLAY}
        </span>
      </HeadingLevelThree>
      <ul className={styles.tournamentList}>
        {sortedScheduleByName.map(it => (
          <TournamentPlayItem
            schedule={it}
            onEditScheduleDetails={onEditScheduleDetails}
            onManageTournamentPlay={onManageTournamentPlay}
            key={it.schedule_id}
          />
        ))}
      </ul>
    </SectionDropdown>
  );
};
