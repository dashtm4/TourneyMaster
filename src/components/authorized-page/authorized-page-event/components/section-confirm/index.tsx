import React from 'react';
import { Button, Input } from 'components/common';
import { BindingAction, IEventDetails, ISchedule } from 'common/models';
import { ButtonColors, ButtonVarian } from 'common/enums';
import { IInputEvent } from 'common/types';
import { getSettingsComponents, getSettingItemById } from '../../helpers';
import {
  EventPublishTypes,
  IPublishSettings,
  PublishFromFields,
} from '../../common';
import styles from './styles.module.scss';

const BUTTON_STYLES = {
  width: '115px',
};

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  publishType: EventPublishTypes;
  onClose: BindingAction;
}

const ConfirmSection = ({ event, schedules, publishType, onClose }: Props) => {
  const [publishSettings, changePublishSettings] = React.useState<
    IPublishSettings
  >({
    activeSchedule: schedules[0],
  });
  const [confirmValue, changeConfirmValues] = React.useState('');

  const onChangeConfirmValue = ({ target }: IInputEvent) => {
    changeConfirmValues(target.value);
  };

  const onChangeSettings = ({ target: { name, value } }: IInputEvent) => {
    const settingItem = getSettingItemById(
      name as PublishFromFields,
      value,
      schedules
    );

    changePublishSettings({
      ...publishSettings,
      [name]: settingItem,
    });
  };

  return (
    <>
      <form className={styles.selectsWrapper}>
        {getSettingsComponents(
          publishType,
          publishSettings,
          schedules,
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
