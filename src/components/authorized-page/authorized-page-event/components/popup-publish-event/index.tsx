/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Modal, HeadingLevelTwo, Button, Radio } from 'components/common';
import ConfirmSection from '../section-confirm';
import {
  BindingAction,
  IEventDetails,
  ISchedule,
  IFetchedBracket,
  BindingCbWithTwo,
  IPublishSettings,
} from 'common/models';
import { ButtonVarian, ButtonColors, EventPublishTypes } from 'common/enums';
import { IInputEvent } from 'common/types';
import { getEventPublishOptions } from '../../helpers';
import styles from './styles.module.scss';

const BUTTON_STYLES = {
  width: '115px',
};

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  brackets: IFetchedBracket[];
  isOpen: boolean;
  onClose: BindingAction;
  publishEventData: BindingCbWithTwo<EventPublishTypes, IPublishSettings>;
}

const PopupPublishEvent = ({
  event,
  schedules,
  brackets,
  isOpen,
  onClose,
  publishEventData,
}: Props) => {
  const eventPublishOptions = getEventPublishOptions(
    event,
    schedules,
    brackets
  );
  const DEFAULT_PUBLISH_OPTION = eventPublishOptions[0];

  const [isConfrimOpen, toggleConfrim] = React.useState<boolean>(false);
  const [publishType, changePublishValue] = React.useState<string>(
    DEFAULT_PUBLISH_OPTION
  );

  React.useEffect(() => {
    toggleConfrim(false);
    changePublishValue(DEFAULT_PUBLISH_OPTION);
  }, [isOpen]);

  const onChangePublishValue = ({ target }: IInputEvent) => {
    changePublishValue(target.value);
  };

  const onToggleConfrim = () => {
    toggleConfrim(!isConfrimOpen);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Publish Event to Public Portals</HeadingLevelTwo>
        </div>
        {isConfrimOpen ? (
          <ConfirmSection
            event={event}
            schedules={schedules}
            brackets={brackets}
            publishType={publishType as EventPublishTypes}
            onClose={onClose}
            publishEventData={publishEventData}
          />
        ) : (
          <>
            <div className={styles.radioWrapper}>
              <Radio
                onChange={onChangePublishValue}
                options={eventPublishOptions}
                checked={publishType}
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
                  onClick={onToggleConfrim}
                  variant={ButtonVarian.CONTAINED}
                  color={ButtonColors.PRIMARY}
                  btnStyles={BUTTON_STYLES}
                  label="Save"
                />
              </span>
            </p>
          </>
        )}
      </section>
    </Modal>
  );
};

export default PopupPublishEvent;
