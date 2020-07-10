import React from 'react';
import { BindingAction } from 'common/models';
import { CardMessage, Button, Modal } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
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
}

export default ({ isOpen, onClose }: Props) => (
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
        Warning: This event is currently published. <br />
        You would need to "unpublish" the event if you would like to edit it.
      </p>
      <p className={styles.btnsWrapper}>
        <Button
          onClick={onClose}
          label="Cancel"
          variant="text"
          color="secondary"
        />
      </p>
    </section>
  </Modal>
);
