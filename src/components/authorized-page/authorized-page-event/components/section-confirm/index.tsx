import React from 'react';
import { Button, Input } from 'components/common';
import { BindingAction, IEventDetails } from 'common/models';
import { ButtonColors, ButtonVarian } from 'common/enums';
import styles from './styles.module.scss';
import { IInputEvent } from 'common/types';

const BUTTON_STYLES = {
  width: '115px',
};

interface Props {
  event: IEventDetails;
  onClose: BindingAction;
}

const ConfirmSection = ({ event, onClose }: Props) => {
  const [confirmValue, changeConfirmValues] = React.useState('');

  const onChangeConfirmValue = ({ target }: IInputEvent) => {
    changeConfirmValues(target.value);
  };

  return (
    <>
      <div className={styles.inputWrapper}>
        <p>Enter event name to confirm publication</p>
        <Input value={confirmValue} onChange={onChangeConfirmValue} />
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
