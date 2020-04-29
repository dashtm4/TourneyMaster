import React from 'react';
import { IEventDetails, BindingAction } from 'common/models';

import { HeadingLevelTwo, Modal, Input, Button } from 'components/common';
import { IInputEvent } from 'common/types';
import { ButtonVarian, ButtonColors } from 'common/enums';
import styles from './styles.module.scss';

const BUTTON_STYLES = {
  width: '115px',
};

interface Props {
  event: IEventDetails;
  isOpen: boolean;
  onClose: BindingAction;
  unpublishEventData: BindingAction;
}

const PopupUnpublishEvent = ({
  event,
  isOpen,
  onClose,
  unpublishEventData,
}: Props) => {
  const [confirmValue, changeConfirmValue] = React.useState('');
  const trimmedEventName = event.event_name.trim();

  React.useEffect(() => {
    changeConfirmValue('');
  }, [isOpen]);

  const onChangeInputValue = ({ target }: IInputEvent) => {
    changeConfirmValue(target.value);
  };

  const onConfirm = () => {
    unpublishEventData();

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.sectionWrapper}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Unpublish event</HeadingLevelTwo>
        </div>
        <p className={styles.descWrapper}>
          Enter event name to unpublish event
        </p>
        <div className={styles.inputWrapper}>
          <Input
            onChange={onChangeInputValue}
            value={confirmValue}
            placeholder="Event name"
            autofocus
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
              onClick={onConfirm}
              variant={ButtonVarian.CONTAINED}
              color={ButtonColors.PRIMARY}
              btnStyles={BUTTON_STYLES}
              disabled={confirmValue !== trimmedEventName}
              label="Confirm"
            />
          </span>
        </p>
      </section>
    </Modal>
  );
};

export default PopupUnpublishEvent;
