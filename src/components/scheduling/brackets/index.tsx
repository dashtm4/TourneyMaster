import React from 'react';
import { SectionDropdown, HeadingLevelThree, Button } from 'components/common';
import BraketsItem from '../brakets-item';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';
import { compareTime } from 'helpers';
import { BindingAction } from 'common/models';

interface IProps {
  schedules: ISchedulingSchedule[];
  eventId: string;
  isSectionExpand: boolean;
  bracketCreationAllowed: boolean;
  onCreateBracket: BindingAction;
}

const Brackets = (props: IProps) => {
  const {
    schedules,
    eventId,
    isSectionExpand,
    bracketCreationAllowed,
    onCreateBracket,
  } = props;

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
      expanded={isSectionExpand}
      id={EventMenuTitles.BRACKETS}
    >
      <>
        <HeadingLevelThree>
          <span className={styles.blockHeading}>
            {EventMenuTitles.BRACKETS}
          </span>
        </HeadingLevelThree>
        <Button
          btnStyles={{ float: 'right' }}
          label="Create New Bracket Version"
          color="primary"
          variant="contained"
          onClick={onCreateBracket}
          disabled={!bracketCreationAllowed}
        />
      </>
      <ul className={styles.braketsList}>
        {sortedScheduleByName.map(it => (
          <BraketsItem schedule={it} eventId={eventId} key={it.schedule_id} />
        ))}
      </ul>
    </SectionDropdown>
  );
};
export default Brackets;
