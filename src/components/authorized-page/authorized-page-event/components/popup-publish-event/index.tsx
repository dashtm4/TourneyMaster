import React from 'react';
import { Modal, HeadingLevelTwo, Button, Radio } from 'components/common';
import ConfirmSection from '../section-confirm';
import { BindingAction, IEventDetails, ISchedule } from 'common/models';
import { ButtonVarian, ButtonColors } from 'common/enums';
import { EventPublishTypes } from '../../common';
import { IInputEvent } from 'common/types';
import styles from './styles.module.scss';

const BUTTON_STYLES = {
  width: '115px',
};

const eventPublishOptions = Object.values(EventPublishTypes);
const DEFAULT_PUBLISH_OPTION = eventPublishOptions[0];

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  isOpen: boolean;
  onClose: BindingAction;
}

const PopupPublishEvent = ({ event, schedules, isOpen, onClose }: Props) => {
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
            publishType={publishType as EventPublishTypes}
            onClose={onClose}
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
