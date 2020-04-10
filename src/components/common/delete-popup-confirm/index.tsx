import React from 'react';
import { Button, Modal, Input } from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { capitalize } from 'lodash';

interface Props {
  type: string;
  deleteTitle: string;
  isOpen: boolean;
  onClose: BindingAction;
  onDeleteClick: BindingAction;
  message?: string;
}

const PopupDeleteConfirm = ({
  type,
  deleteTitle,
  isOpen,
  onClose,
  onDeleteClick,
  message,
}: Props) => {
  const [inputValue, onChange] = React.useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.popupWrapper}>
        <h2 className={styles.title}>
          {!type
            ? `Delete ${deleteTitle}?`
            : `Delete '${deleteTitle}' ${type}?`}
        </h2>
        <div className={styles.confirmWrapper}>
          <p className={styles.confirmDesc}>{message}</p>
          <Input
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              onChange(evt.target.value)
            }
            value={inputValue}
            placeholder={`${capitalize(type)} name`}
            autofocus
          />
        </div>
        <p className={styles.btnsWrapper}>
          <span className={styles.cancelBtnWrapper}>
            <Button
              onClick={onClose}
              label="Cancel"
              variant="text"
              color="secondary"
            />
          </span>
          <Button
            onClick={onDeleteClick}
            label="Delete"
            variant="contained"
            type="danger"
            color="primary"
            disabled={deleteTitle !== inputValue}
          />
        </p>
      </section>
    </Modal>
  );
};

export default PopupDeleteConfirm;
