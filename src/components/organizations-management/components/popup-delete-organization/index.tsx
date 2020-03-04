import React from 'react';
import { Button, Modal, Input } from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  deleteTitle: string;
  isOpen: boolean;
  onClose: BindingAction;
  onCancelClick: BindingAction;
  onDeleteClick: BindingAction;
}

const PopupDeleteOrganization = ({
  deleteTitle,
  isOpen,
  onClose,
  onCancelClick,
  onDeleteClick,
}: Props) => {
  const [inputValue, onChange] = React.useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.popupWrapper}>
        <h2 className={styles.title}>Delete “{deleteTitle}” organization?</h2>
        <div className={styles.confirmWrapper}>
          <p className={styles.confirmDesc}>
            You are about to delete this organization and this cannot be done.
            Please enter the name of the organization you wish to delete to
            continue
          </p>
          <Input
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              onChange(evt.target.value)
            }
            value={inputValue}
            placeholder="Team name"
          />
        </div>
        <p className={styles.btnsWrapper}>
          <span className={styles.cancelBtnWrapper}>
            <Button
              onClick={onCancelClick}
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

export default PopupDeleteOrganization;
