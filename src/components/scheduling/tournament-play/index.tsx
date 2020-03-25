import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import { sortByField } from 'helpers';
import { BindingCbWithOne } from 'common/models';
import { EventMenuTitles, SortByFilesTypes } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface IProps {
  schedules: ISchedulingSchedule[];
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
  eventId: string;
}

export default (props: IProps) => {
  const { schedules, eventId, onEditSchedule } = props;
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
            eventId={eventId}
            onEditSchedule={onEditSchedule}
            key={it.schedule_id}
          />
        ))}
      </ul>
    </SectionDropdown>
  );
};
