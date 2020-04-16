import React from 'react';
import {
  Modal,
  HeadingLevelTwo,
  Select,
  Input,
  Button,
} from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { ButtonVarian, ButtonColors } from 'common/enums';

interface Props {
  isOpen: boolean;
  onClose: BindingAction;
}

const PopupEditPool = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Edit Pool</HeadingLevelTwo>
        </div>
        <div className={styles.selectWrapper}>
          <Select options={[]} value="" />
        </div>
        <fieldset className={styles.inputsWrapper}>
          <legend className="visually-hidden">Pool information</legend>
          <ul className={styles.inputsList}>
            <li>
              <Input label="Name" />
            </li>
            <li>
              <Input label="Tag" startAdornment="@" />
            </li>
          </ul>
        </fieldset>
        <p className={styles.btnsWrapper}>
          <Button
            onClick={onClose}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Cancel"
          />
          <span className={styles.btnWrapper}>
            <Button
              variant={ButtonVarian.CONTAINED}
              color={ButtonColors.PRIMARY}
              label="Save"
            />
          </span>
        </p>
      </section>
    </Modal>
  );
};

export default PopupEditPool;
