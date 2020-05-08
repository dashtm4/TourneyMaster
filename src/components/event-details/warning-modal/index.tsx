import React from 'react';
import { CardMessage, Button, Modal } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

const CARD_MESSAGE_STYLES = {
  marginBottom: '15px',
  fontSize: '16px',
  lineHeight: '22px',
  fontWeight: '700',
};

const ICON_CARD_STYLES = {
  fill: '#FFCB00',
};

interface Props {
  isOpen: boolean;
  onClose: BindingAction;
  onExitClick: BindingAction;
  onSaveClick: BindingAction;
}

export default ({ isOpen, onClose, onExitClick, onSaveClick }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <section className={styles.popupWrapper}>
      <CardMessage
        type={CardMessageTypes.WARNING}
        style={CARD_MESSAGE_STYLES}
        iconStyle={ICON_CARD_STYLES}
      >
        Warning
      </CardMessage>
      <p className={styles.popupText}>
        Schedules and playoffs are attached to this event. Please be careful,
        any change on this page may lead to a change in the Playoff or Schedule.
      </p>
      <p className={styles.btnsWrapper}>
        <Button
          onClick={onExitClick}
          label="Cancel"
          variant="text"
          color="secondary"
        />
        <Button
          onClick={onSaveClick}
          label="Save Anyway"
          variant="contained"
          color="primary"
        />
      </p>
    </section>
  </Modal>
);
