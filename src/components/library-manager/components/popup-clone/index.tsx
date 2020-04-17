import React from 'react';
import { Modal, HeadingLevelTwo, Input, Button } from 'components/common';
import { IEventDetails, BindingAction, BindingCbWithOne } from 'common/models';
import { ButtonVarian, ButtonColors } from 'common/enums';
import styles from './styles.module.scss';
import { IInputEvent } from 'common/types';

interface Props {
  activeEvent: IEventDetails | null;
  events: IEventDetails[];
  isOpen: boolean;
  onClose: BindingAction;
  onSave: BindingAction;
  onChangeActiveEvent: BindingCbWithOne<IEventDetails>;
}

const PopupCLone = ({ isOpen, onClose, onSave }: Props) => {
  const [newName, changeName] = React.useState<string>('');

  const onChangeName = ({ target }: IInputEvent) => {
    changeName(target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Clone from library</HeadingLevelTwo>
        </div>
        <div className={styles.inputWrapper}>
          <Input
            onChange={onChangeName}
            value={newName}
            label="Enter name"
            width="100%"
          />
        </div>
        <p className={styles.btnsWrapper}>
          <span className={styles.btnWrapper}>
            <Button
              onClick={onClose}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              label="Cancel"
            />
          </span>
          <span className={styles.btnWrapper}>
            <Button
              onClick={onSave}
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

export default PopupCLone;
