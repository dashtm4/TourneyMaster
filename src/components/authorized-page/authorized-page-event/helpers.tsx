import React from 'react';
import { Select } from 'components/common';
import { getSelectOptions } from 'helpers';
import {
  BindingCbWithOne,
  ISchedule,
  IFetchedBracket,
  IPublishSettings,
  ScheduleStatuses,
  IEventDetails,
} from 'common/models';
import {
  IScheduleFields,
  IBracketFields,
  EventPublishTypes,
  BracketStatuses,
  EventStatuses,
} from 'common/enums';
import { IInputEvent } from 'common/types';
import { PublishSettingFields } from './common';

const checkPublishedEvent = (event: IEventDetails): boolean => {
  const isPublished = event.is_published_YN === EventStatuses.Draft;

  return isPublished;
};

const checkPublishedSchedule = (schedules: ISchedule[]): boolean => {
  const hasPublished =
    schedules.length > 0 &&
    schedules.every(it => it.schedule_status === ScheduleStatuses.DRAFT);

  return hasPublished;
};

const checkPublishedBracket = (brackets: IFetchedBracket[]): boolean => {
  const hasPublished =
    brackets.length > 0 &&
    brackets.every(it => it.is_published_YN === BracketStatuses.Draft);

  return hasPublished;
};

const checkAllPublishes = (
  event: IEventDetails,
  schedules: ISchedule[],
  brackets: IFetchedBracket[]
): boolean => {
  const hasAllPublished =
    checkPublishedEvent(event) &&
    checkPublishedSchedule(schedules) &&
    checkPublishedBracket(brackets);

  return hasAllPublished;
};

const CheckEventPublishes = {
  checkPublishedEvent,
  checkPublishedSchedule,
  checkPublishedBracket,
  checkAllPublishes,
};

const getEventPublishOptions = (
  event: IEventDetails,
  schedules: ISchedule[],
  brackets: IFetchedBracket[]
) => {
  const eventPublishOptions = [];

  if (CheckEventPublishes.checkPublishedEvent(event)) {
    eventPublishOptions.push(EventPublishTypes.DETAILS);
  }

  if (CheckEventPublishes.checkPublishedSchedule(schedules)) {
    eventPublishOptions.push(EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY);
  }

  if (CheckEventPublishes.checkPublishedBracket(brackets)) {
    eventPublishOptions.push(
      EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS
    );
  }

  return eventPublishOptions;
};

const getSettingsComponents = (
  publishType: EventPublishTypes,
  publishSettings: IPublishSettings,
  schedules: ISchedule[],
  brackets: IFetchedBracket[],
  onChangeSettings: BindingCbWithOne<IInputEvent>
) => {
  const { activeSchedule, activeBracket } = publishSettings;

  switch (publishType) {
    case EventPublishTypes.DETAILS: {
      return null;
    }
    case EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY: {
      const scheduleOptions = getSelectOptions(
        schedules,
        IScheduleFields.SCHEDULE_ID,
        IScheduleFields.SCHEDULE_NAME
      );

      return (
        <Select
          onChange={onChangeSettings}
          name={PublishSettingFields.ACTIVE_SCHEDULE}
          options={scheduleOptions}
          value={activeSchedule?.schedule_id || ''}
          label="Schedules:"
        />
      );
    }
    case EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS: {
      const scheduleOptions = getSelectOptions(
        schedules,
        IScheduleFields.SCHEDULE_ID,
        IScheduleFields.SCHEDULE_NAME
      );

      const bracketsOptions = getSelectOptions(
        brackets,
        IBracketFields.BRACKET_ID,
        IBracketFields.BRACKET_NAME
      );

      return (
        <>
          <Select
            onChange={onChangeSettings}
            name={PublishSettingFields.ACTIVE_SCHEDULE}
            options={scheduleOptions}
            value={activeSchedule?.schedule_id || ''}
            label="Schedules:"
          />
          <Select
            onChange={onChangeSettings}
            name={PublishSettingFields.ACTIVE_BRACKET}
            options={bracketsOptions}
            value={activeBracket?.bracket_id || ''}
            label="Brackets:"
          />
        </>
      );
    }
  }

  return null;
};

const getSettingItemById = (
  formField: PublishSettingFields,
  id: string,
  schedules: ISchedule[],
  brackets: IFetchedBracket[]
) => {
  switch (formField) {
    case PublishSettingFields.ACTIVE_SCHEDULE: {
      const activeSchedule = schedules.find(it => it.schedule_id === id);

      return activeSchedule;
    }
    case PublishSettingFields.ACTIVE_BRACKET: {
      const activeBracket = brackets.find(it => it.bracket_id === id);

      return activeBracket;
    }
  }
};

export { getSettingsComponents, getSettingItemById, getEventPublishOptions };
