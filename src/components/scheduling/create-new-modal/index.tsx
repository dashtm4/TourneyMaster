import React, { useState, useRef } from 'react';
import {
  Modal,
  HeadingLevelFour,
  Input,
  Button,
  Radio,
} from 'components/common';
import styles from './styles.module.scss';
import {
  IConfigurableSchedule,
  ScheduleCreationType,
} from 'common/models/schedule';
import { ArchitectFormFields } from '../types';
import useOnclickOutside from 'react-cool-onclickoutside';
import {
  getScheduleCreationTypeOptions,
  mapScheduleCreationTypeToOption,
  mapScheduleCreationOptionToType,
} from './helpers';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule: IConfigurableSchedule;
  isOpen: boolean;
  onChange: (name: string, value: any) => void;
  onCreate: (schedule: IConfigurableSchedule, visualGamesMakerUsed: boolean) => void;
  onClose: () => void;
}

const CreateNewModal = (props: IProps) => {
  const { schedule, isOpen, onCreate, onClose, onChange } = props;

  const localChange = ({ target: { name, value } }: InputTargetValue) => {
    onChange(name, value);
  };

  const [step, setStep] = useState(1);
  const [type, setType] = useState(ScheduleCreationType.Scheduler);

  const typeOptions = getScheduleCreationTypeOptions();

  const onTypeChange = (e: InputTargetValue) =>
    setType(mapScheduleCreationOptionToType(e.target.value));

  const localClose = () => {
    onChange('schedule_name', '');
    onClose();
  };

  const onCancelClick = () => {
    localClose();
    setStep(1);
    setType(ScheduleCreationType.Scheduler);
  };

  const ref = useRef<HTMLDivElement>(null);
  useOnclickOutside(ref, () => {
    localClose();
    setStep(1);
    setType(ScheduleCreationType.Scheduler);
  });

  const onCreateWithScheduler = () => {
    setCreationType(ScheduleCreationType.Scheduler);
    onCreate(schedule, false);
  };

  const onCreateWithVisualGamesMaker = () => {
    setCreationType(ScheduleCreationType.VisualGamesMaker);
    onCreate(schedule, true);
  };

  const onCreateManually = () => {
    setCreationType(ScheduleCreationType.Manually);
    onCreate(schedule, false);
  };

  const setCreationType = (t: ScheduleCreationType) => {
    onChange('creationType', t);
  };

  const renderStepOne = () => {
    return (
      isOpen && (
        <div>
          <p className={styles.message}>
            Do you want to use 'Scheduling Algorithm', 'Visual Games Maker' or
            create schedule manually?
          </p>
          <div className={styles.radioBtnsWrapper}>
            <Radio
              options={typeOptions}
              formLabel=""
              onChange={onTypeChange}
              checked={mapScheduleCreationTypeToOption(type)}
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

  const chooseOnCreateFunction = (createType: ScheduleCreationType) => {
    switch (createType) {
      case ScheduleCreationType.Scheduler:
        return onCreateWithScheduler;
      case ScheduleCreationType.VisualGamesMaker:
        return onCreateWithVisualGamesMaker;
      case ScheduleCreationType.Manually:
        return onCreateManually;
      default:
        return onCreateWithScheduler;
    }
  };

  const renderStepTwo = () => {
    return (
      <div>
        <div className={styles.inputsWrapper}>
          <Input
            onChange={localChange}
            value={schedule.schedule_name || ''}
            label="Name"
            autofocus={true}
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
            onClick={chooseOnCreateFunction(type)}
            disabled={!schedule.schedule_name?.length}
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
    <Modal isOpen={isOpen} onClose={localClose}>
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
