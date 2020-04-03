import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import BraketsItem from '../brakets-item';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';
import { compareTime } from 'helpers';

interface IProps {
  schedules: ISchedulingSchedule[];
  eventId: string;
  isSectionCollapse: boolean;
}

const Brackets = ({ schedules, eventId, isSectionCollapse }: IProps) => {
  const sortedScheduleByName = schedules.sort(
    (a, b) =>
      compareTime(a.updated_datetime, b.updated_datetime) ||
      compareTime(a.created_datetime, b.created_datetime)
  );

  return (
    <SectionDropdown
      type="section"
      isDefaultExpanded={true}
      useBorder={true}
      expanded={isSectionCollapse}
      id={EventMenuTitles.BRACKETS}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>{EventMenuTitles.BRACKETS}</span>
      </HeadingLevelThree>
      <ul className={styles.braketsList}>
        {sortedScheduleByName.map(it => (
          <BraketsItem schedule={it} eventId={eventId} key={it.schedule_id} />
        ))}
      </ul>
    </SectionDropdown>
  );
};
export default Brackets;
