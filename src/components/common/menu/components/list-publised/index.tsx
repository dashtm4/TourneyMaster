import React from 'react';
import ItemPublished from '../item-published';
import { IEventDetails, ISchedule, IFetchedBracket } from 'common/models';
import { PublishedItemTitles } from '../../common';
import { EventPublishTypes } from 'common/enums';
import { CheckEventDrafts } from 'helpers';
import styles from './styles.module.scss';

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  brackets: IFetchedBracket[];
}

const ListPublished = ({ event, schedules, brackets }: Props) => {
  const isEventDrafted = CheckEventDrafts.checkDraftEvent(event);
  const isScheduleDrafted = CheckEventDrafts.checkDraftSchedule(schedules);
  const isBracketDrafted = CheckEventDrafts.checkDraftBracket(brackets);

  return (
    <ul className={styles.publishedList}>
      <ItemPublished
        title={PublishedItemTitles[EventPublishTypes.DETAILS]}
        isPublish={isEventDrafted}
      />
      <ItemPublished
        title={
          PublishedItemTitles[EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY]
        }
        isPublish={isScheduleDrafted}
      />
      <ItemPublished
        title={
          PublishedItemTitles[
            EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS
          ]
        }
        isPublish={isBracketDrafted}
      />
    </ul>
  );
};

export default ListPublished;
