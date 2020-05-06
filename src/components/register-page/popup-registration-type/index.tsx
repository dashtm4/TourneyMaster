import React from 'react';
import { Modal, HeadingLevelFour, Radio, Button } from 'components/common';
import styles from '../styles.module.scss';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { IInputEvent } from 'common/types';
import { TypeOptions, typeOptions } from '../index';

interface Props {
  isOpenModalOpen: boolean;
  onTypeSelect: BindingAction;
  type: number;
  onTypeChange: BindingCbWithOne<IInputEvent>;
}

const PopupRegistrationType = ({
  type,
  onTypeChange,
  isOpenModalOpen,
  onTypeSelect,
}: Props) => {
  return (
    <Modal isOpen={isOpenModalOpen} onClose={() => {}}>
      <div className={styles.modalContainer}>
        <div style={{ height: '190px' }}>
          <HeadingLevelFour>
            <span>Event Registration</span>
          </HeadingLevelFour>
          <p className={styles.message}>
            Do you want to register as an individual or as a team?
          </p>
          <div className={styles.radioBtnsWrapper}>
            <Radio
              options={typeOptions}
              formLabel=""
              onChange={onTypeChange}
              checked={TypeOptions[type] || ''}
            />
          </div>
          <div className={styles.btnWrapper}>
            <Button
              label="Next"
              color="primary"
              variant="contained"
              onClick={onTypeSelect}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PopupRegistrationType;
