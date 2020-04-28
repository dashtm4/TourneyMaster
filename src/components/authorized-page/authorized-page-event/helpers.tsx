import React from 'react';
import { Select } from 'components/common';
import { getSelectOptions } from 'helpers';
import { BindingCbWithOne, ISchedule } from 'common/models';
import { IScheduleFields } from 'common/enums';
import { IInputEvent } from 'common/types';
import {
  EventPublishTypes,
  IPublishSettings,
  PublishSettingFields,
} from './common';

const getSettingsComponents = (
  publishType: EventPublishTypes,
  publishSettings: IPublishSettings,
  schedules: ISchedule[],
  onChangeSettings: BindingCbWithOne<IInputEvent>
) => {
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
          value={publishSettings.activeSchedule.schedule_id}
        />
      );
    }
    case EventPublishTypes.DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS: {
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
          value={publishSettings.activeSchedule.schedule_id}
        />
      );
    }
  }

  return null;
};

const getSettingItemById = (
  formField: PublishSettingFields,
  id: string,
  schedules: ISchedule[]
) => {
  switch (formField) {
    case PublishSettingFields.ACTIVE_SCHEDULE: {
      const activeSchedule = schedules.find(it => it.schedule_id === id);

      return activeSchedule;
    }
  }
};

export { getSettingsComponents, getSettingItemById };
