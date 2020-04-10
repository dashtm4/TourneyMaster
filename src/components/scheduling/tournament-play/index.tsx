import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import {
  SectionDropdown,
  HeadingLevelThree,
  CardMessage,
} from 'components/common';
import { BindingCbWithOne, ISchedule } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';
import { CardMessageTypes } from 'components/common/card-message/types';
import { orderBy } from 'lodash-es';

interface IProps {
  schedules: ISchedulingSchedule[];
  eventId: string;
  savingInProgress?: boolean;
  isSectionsExpand: boolean;
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
  onPublish: (schedule: ISchedule) => void;
  onUnpublish: (schedule: ISchedule) => void;
}

export default (props: IProps) => {
  const {
    onPublish,
    onUnpublish,
    savingInProgress,
    schedules,
    eventId,
    isSectionsExpand,
    onEditSchedule,
  } = props;

  const sortedSchedules = orderBy(
    schedules,
    ({ schedule_status, updated_datetime }) => [
      schedule_status,
      updated_datetime,
    ],
    ['desc', 'desc']
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
      expanded={isSectionsExpand}
      useBorder={true}
      id={EventMenuTitles.TOURNAMENT_PLAY}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>
          {EventMenuTitles.TOURNAMENT_PLAY}
        </span>
      </HeadingLevelThree>
      <ul className={styles.tournamentList}>
        <CardMessage
          style={{ marginBottom: 30, width: '100%' }}
          type={CardMessageTypes.EMODJI_OBJECTS}
        >
          Schedules are sorted first on Status then on Last Update Date
        </CardMessage>
        {sortedSchedules.map(it => (
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
