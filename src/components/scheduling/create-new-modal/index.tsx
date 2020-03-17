import React from 'react';
import { Modal, HeadingLevelFour, Input, Button } from 'components/common';
import styles from './styles.module.scss';
import { ISchedule } from 'common/models/schedule';
import { BindingAction } from 'common/models';
import { ArchitectFormFields } from '../types';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule: ISchedule;
  isOpen: boolean;
  onChange: (name: string, value: any) => void;
  onSave: BindingAction;
  onClose: () => void;
}

const CreateNewModal = (props: IProps) => {
  const { schedule, isOpen, onSave, onClose, onChange } = props;

  const localChange = ({ target: { name, value } }: InputTargetValue) => {
    console.log(name, value);

    onChange(name, value);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => null}>
      <div className={styles.wrapper}>
        <HeadingLevelFour>
          <span>Create Schedule</span>
        </HeadingLevelFour>
        <div className={styles.inputsWrapper}>
          <Input
            onChange={localChange}
            value={schedule.name || ''}
            label="Name"
            name={ArchitectFormFields.NAME}
          />
          <Input
            onChange={localChange}
            value={schedule.tag || ''}
            label="Tag"
            name={ArchitectFormFields.TAG}
          />
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
            onClick={onSave}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewModal;
