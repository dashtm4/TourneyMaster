import React from 'react';
import { Button, Modal } from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  message: string;
  isOpen: boolean;
  onClose: BindingAction;
  onCanceClick: BindingAction;
  onYesClick: BindingAction;
}

const PopupConfirm = ({
  message,
  isOpen,
  onClose,
  onCanceClick,
  onYesClick,
}: Props) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <section className={styles.popupWrapper}>
      <h2 className="visually-hidden">Warning</h2>
      <p className={styles.popupText}>{message}</p>
      <p className={styles.btnsWrapper}>
        <span className={styles.exitBtnWrapper}>
          <Button
            onClick={onCanceClick}
            label="Cance"
            variant="text"
            color="secondary"
          />
        </span>
        <Button
          onClick={onYesClick}
          label="Yes"
          variant="contained"
          color="primary"
        />
      </p>
    </section>
  </Modal>
);

export default PopupConfirm;
