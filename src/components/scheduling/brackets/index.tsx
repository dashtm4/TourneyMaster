import React from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Button,
  CardMessage,
} from 'components/common';
import BraketsItem from '../brakets-item';
import { compareTime } from 'helpers';
import { BindingAction } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import { CardMessageTypes } from 'components/common/card-message/types';
import styles from '../styles.module.scss';

const CARD_MESSAGE_STYLES = {
  marginBottom: 30,
  width: '100%',
};

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
      {sortedScheduleByName.length !== 0 ? (
        <ul className={styles.braketsList}>
          {sortedScheduleByName.map(it => (
            <BraketsItem schedule={it} eventId={eventId} key={it.schedule_id} />
          ))}
        </ul>
      ) : (
        <CardMessage
          style={CARD_MESSAGE_STYLES}
          type={CardMessageTypes.EMODJI_OBJECTS}
        >
          Please create the first braket by clicking on the button to
          continue...
        </CardMessage>
      )}
    </SectionDropdown>
  );
};
export default Brackets;
