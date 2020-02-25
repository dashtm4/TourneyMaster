import React, { useState } from 'react';
import { Modal, HeadingLevelFour, Input, Button } from 'components/common';
import styles from './styles.module.scss';
import { INewVersion } from '../logic/actions';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  isOpen: boolean;
  onSave: (data: INewVersion) => void;
  onClose: () => void;
}

const CreateNewModal = (props: IProps) => {
  const { isOpen, onSave, onClose } = props;

  const [name, setName] = useState('');
  const [tag, setTag] = useState('');

  const onChangeName = (e: InputTargetValue) => setName(e.target.value);
  const onChangeTag = (e: InputTargetValue) => setTag(e.target.value);

  const onSavePressed = () => {
    onSave({ name, tag });
    setName('');
    setTag('');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => null}>
      <div className={styles.wrapper}>
        <HeadingLevelFour>
          <span>Create Schedule</span>
        </HeadingLevelFour>
        <div className={styles.inputsWrapper}>
          <Input label="Name" value={name} onChange={onChangeName} />
          <Input label="Tag" value={tag} onChange={onChangeTag} />
        </div>
        <div className={styles.firstRow}>
          <div className={styles.infoCell}>
            <span>Divisions:</span>
            <p>2</p>
          </div>
          <div className={styles.infoCell}>
            <span>Teams:</span>
            <p>24</p>
          </div>
        </div>
        <div className={styles.secondRow}>
          <div className={styles.infoCell}>
            <span>Playoffs:</span>
            <p>Yes</p>
          </div>
          <div className={styles.infoCell}>
            <span>Bracket Type:</span>
            <p>Single Elimination</p>
          </div>
        </div>
        <div className={styles.buttonsWrapper}>
          <Button
            label="Cancel"
            color="secondary"
            variant="text"
            onClick={onClose}
          />
          <Button
            label="Save"
            color="primary"
            variant="contained"
            onClick={onSavePressed}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewModal;
