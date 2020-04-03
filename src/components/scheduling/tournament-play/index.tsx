import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import { compareTime } from 'helpers';
import { BindingCbWithOne } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface IProps {
  schedules: ISchedulingSchedule[];
  eventId: string;
  isSectionCollapse: boolean;
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
}

export default (props: IProps) => {
  const { schedules, eventId, isSectionCollapse, onEditSchedule } = props;

  const sortedScheduleByName = schedules.sort(
    (a, b) =>
      compareTime(a.updated_datetime, b.updated_datetime) ||
      compareTime(a.created_datetime, b.created_datetime)
  );

  return (
    <SectionDropdown
      type="section"
      isDefaultExpanded={true}
      expanded={isSectionCollapse}
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
