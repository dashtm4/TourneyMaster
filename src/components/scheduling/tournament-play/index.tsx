import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import { compareTime } from 'helpers';
import { BindingCbWithOne, ISchedule } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';

interface IProps {
  schedules: ISchedulingSchedule[];
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
  eventId: string;
  savingInProgress?: boolean;
  onPublish: (schedule: ISchedule) => void;
  onUnpublish: (schedule: ISchedule) => void;
}

export default (props: IProps) => {
  const {
    schedules,
    eventId,
    onEditSchedule,
    onPublish,
    onUnpublish,
    savingInProgress,
  } = props;

  const sortedScheduleByName = schedules.sort(
    (a, b) =>
      compareTime(a.updated_datetime, b.updated_datetime) ||
      compareTime(a.created_datetime, b.created_datetime)
  );

  const isSchedulePublished = (id: string) => {
    const schedule = schedules.find(
      item => item.schedule_status === 'Published'
    );
    return schedule && schedule.schedule_id === id;
  };

  const isAnotherSchedulePublished = (id: string) => {
    const schedule = schedules.find(
      item => item.schedule_status === 'Published'
    );
    return schedule && schedule.schedule_id !== id;
  };

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
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            anotherSchedulePublished={isAnotherSchedulePublished(
              it?.schedule_id
            )}
            schedulePublished={isSchedulePublished(it?.schedule_id)}
            savingInProgress={savingInProgress}
          />
        ))}
      </ul>
    </SectionDropdown>
  );
};
