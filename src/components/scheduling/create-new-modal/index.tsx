import React, { useState, useRef } from 'react';
import {
  Modal,
  HeadingLevelFour,
  Input,
  Button,
  Radio,
} from 'components/common';
import styles from './styles.module.scss';
import { IConfigurableSchedule } from 'common/models/schedule';
import { ArchitectFormFields } from '../types';
import useOnclickOutside from 'react-cool-onclickoutside';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule: IConfigurableSchedule;
  isOpen: boolean;
  onChange: (name: string, value: any) => void;
  onCreate: (schedule: IConfigurableSchedule) => void;
  onClose: () => void;
}

enum TypeOptions {
  'Use scheduler' = 1,
  'Create Manually' = 2,
}

const CreateNewModal = (props: IProps) => {
  const { schedule, isOpen, onCreate, onClose, onChange } = props;

  const localChange = ({ target: { name, value } }: InputTargetValue) => {
    onChange(name, value);
  };

  const [step, setStep] = useState(1);
  const [type, setType] = useState(1);

  const typeOptions = ['Use scheduler', 'Create Manually'];

  const onTypeChange = (e: InputTargetValue) =>
    setType(TypeOptions[e.target.value]);

  const onCancelClick = () => {
    onClose();
    setStep(1);
    setType(1);
  };

  const ref = useRef<HTMLDivElement>(null);
  useOnclickOutside(ref, () => {
    onClose();
    setStep(1);
    setType(1);
  });

  const onCreateWithScheduler = () => {
    onCreate(schedule);
  };
  const onCreateManually = () => {};

  const renderStepOne = () => {
    return (
      isOpen && (
        <div>
          <p className={styles.message}>
            Do you want to use 'Scheduling Algorithm' or create schedule
            manually?
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
              onClick={() => {
                setStep(2);
              }}
            />
          </div>
        </div>
      )
    );
  };

  const renderStepTwo = () => {
    return (
      <div>
        <div className={styles.inputsWrapper}>
          <Input
            onChange={localChange}
            value={schedule.schedule_name || ''}
            label="Name"
            name={ArchitectFormFields.SCHEDULE_NAME}
          />
          <Input
            onChange={localChange}
            value={schedule.schedule_tag || ''}
            label="Tag"
            name={ArchitectFormFields.SCHEDULT_TAG}
            startAdornment="@"
          />
        </div>
        <div className={styles.firstRow}>
          <div className={styles.infoCell}>
            <span>Divisions:</span>
            <p>{schedule.num_divisions}</p>
          </div>
          <div className={styles.infoCell}>
            <span>Teams:</span>
            <p>{schedule.num_teams}</p>
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
            onClick={onCancelClick}
          />
          <Button
            label="Create"
            color="primary"
            variant="contained"
            onClick={type === 1 ? onCreateWithScheduler : onCreateManually}
            disabled={type === 2}
          />
        </div>
      </div>
    );
  };

  const renderModal = () => {
    switch (step) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      default:
        return renderStepOne();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.wrapper} ref={ref}>
        <HeadingLevelFour>
          <span>Create Schedule</span>
        </HeadingLevelFour>
        {renderModal()}
      </div>
    </Modal>
  );
};

export default CreateNewModal;
