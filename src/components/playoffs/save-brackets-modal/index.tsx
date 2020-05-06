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
  onPrimaryClick: BindingAction;
}

export default ({ isOpen, onClose, onPrimaryClick }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <section className={styles.popupWrapper}>
      <h2 className="visually-hidden">Warning</h2>
      <CardMessage
        type={CardMessageTypes.WARNING}
        style={CARD_MESSAGE_STYLES}
        iconStyle={ICON_CARD_STYLES}
      >
        Brackets data cannot be saved
      </CardMessage>
      <p className={styles.popupText}>
        The Playoff is published. <br />
        You cannot save the data until you have assigned bracket games.
      </p>
      <p className={styles.btnsWrapper}>
        <Button
          label="Ok"
          variant="contained"
          color="primary"
          onClick={onPrimaryClick}
        />
      </p>
    </section>
  </Modal>
);
