import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import { stringToLink } from 'helpers';
import { BindingAction } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface IProps {
  schedules: ISchedulingSchedule[];
  onEditScheduleDetails: BindingAction;
  onManageTournamentPlay: BindingAction;
}

export default (props: IProps) => {
  const { schedules, onEditScheduleDetails, onManageTournamentPlay } = props;

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
      <ul className={styles.tournamentList}>
        {schedules.map(it => (
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
