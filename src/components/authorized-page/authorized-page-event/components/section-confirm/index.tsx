import React from 'react';
import { Button, Input } from 'components/common';
import {
  BindingAction,
  IEventDetails,
  ISchedule,
  IFetchedBracket,
  IPublishSettings,
  BindingCbWithTwo,
} from 'common/models';
import { ButtonColors, ButtonVarian, EventPublishTypes } from 'common/enums';
import { IInputEvent } from 'common/types';
import { getSettingsComponents, getSettingItemById } from '../../helpers';
import { PublishSettingFields } from '../../common';
import styles from './styles.module.scss';

const BUTTON_STYLES = {
  width: '115px',
};

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  brackets: IFetchedBracket[];
  publishType: EventPublishTypes;
  onClose: BindingAction;
  publishEvent: BindingCbWithTwo<EventPublishTypes, IPublishSettings>;
}

const ConfirmSection = ({
  event,
  schedules,
  brackets,
  publishType,
  onClose,
  publishEvent,
}: Props) => {
  const DEFAULT_SELECTED_SCHEDULE = schedules[0] || null;
  const DEFAULT_SELECTED_BRACKET = brackets[0] || null;
  const [publishSettings, changePublishSettings] = React.useState<
    IPublishSettings
  >({
    [PublishSettingFields.ACTIVE_SCHEDULE]: DEFAULT_SELECTED_SCHEDULE,
    [PublishSettingFields.ACTIVE_BRACKET]: DEFAULT_SELECTED_BRACKET,
  });
  const [confirmValue, changeConfirmValues] = React.useState('');

  const onChangeConfirmValue = ({ target }: IInputEvent) => {
    changeConfirmValues(target.value);
  };

  const onChangeSettings = ({ target: { name, value } }: IInputEvent) => {
    const settingItem = getSettingItemById(
      name as PublishSettingFields,
      value,
      schedules,
      brackets
    );

    changePublishSettings({
      ...publishSettings,
      [name]: settingItem,
    });
  };

  const onPublishEvent = () => {
    publishEvent(publishType, publishSettings);

    onClose();
  };

  return (
    <>
      <form className={styles.selectsWrapper}>
        {getSettingsComponents(
          publishType,
          publishSettings,
          schedules,
          brackets,
          onChangeSettings
        )}
      </form>
      <div className={styles.inputWrapper}>
        <p className={styles.inputDesc}>
          Enter event name to confirm publication:
        </p>
        <Input
          value={confirmValue}
          onChange={onChangeConfirmValue}
          placeholder="Event name"
        />
      </div>
      <p className={styles.btnsWrapper}>
        <Button
          onClick={onClose}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          btnStyles={BUTTON_STYLES}
          label="Cancel"
        />
        <span className={styles.btnWrapper}>
          <Button
            onClick={onPublishEvent}
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.PRIMARY}
            btnStyles={BUTTON_STYLES}
            disabled={confirmValue !== event.event_name}
            label="Confirm"
          />
        </span>
      </p>
    </>
  );
};

export default ConfirmSection;
