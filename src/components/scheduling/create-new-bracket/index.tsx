/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  HeadingLevelFour,
  Button,
  Input,
  Select,
  Checkbox,
  Tooltip,
  Radio,
} from 'components/common';
import styles from './styles.module.scss';
import { ISchedule, IEventDetails, IField, IDivision } from 'common/models';
import {
  getTimeFromString,
  timeToString,
  getIcon,
  getVarcharEight,
  getTimeValuesFromEventSchedule,
  calculateTimeSlots,
} from 'helpers';
import { Icons } from 'common/enums';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';
import { errorToast } from 'components/common/toastr/showToasts';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { predictPlayoffTimeSlots } from 'components/schedules/definePlayoffs';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

enum ModalPageEnum {
  chooseMode = 1,
  modalBody = 2,
}

enum ModeOptionEnum {
  'Use Scheduler' = 0,
  'Create Manually' = 1,
}

export interface ICreateBracketModalOutput {
  id: string;
  name: string;
  scheduleId: string;
  alignItems: boolean;
  adjustTime: boolean;
  warmup: string;
  eventId: string;
  bracketDate: string;
  createDate: string;
  startTimeSlot: string;
  endTimeSlot: string;
  isManualCreation?: boolean;
}

interface IProps {
  fields: IField[];
  divisions: IDivision[];
  event?: IEventDetails;
  isOpen: boolean;
  schedules: ISchedule[];
  onClose: () => void;
  onCreateBracket: (scheduleData: ICreateBracketModalOutput) => void;
}

const getWarmupFromSchedule = (
  schedules: ISchedule[],
  selectedSchedule: string
) => {
  const time = schedules.find(item => item.schedule_id === selectedSchedule)
    ?.pre_game_warmup;
  return time;
};

const CreateNewBracket = (props: IProps) => {
  const {
    isOpen,
    onClose,
    schedules,
    onCreateBracket,
    fields,
    divisions,
    event,
  } = props;

  const ModeOptions = ['Use Scheduler', 'Create Manually'];

  const [bracketName, setBracketName] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [alignItems, setAlignItems] = useState(false);
  const [adjustTime, setAdjustTime] = useState(false);
  const [modalPage, setModalPage] = useState(ModalPageEnum.chooseMode);
  const [localWarmup, setLocalWarmup] = useState(
    getWarmupFromSchedule(schedules, selectedSchedule)
  );
  const [mode, setModeOptions] = useState(ModeOptionEnum['Use Scheduler']);
  const [selectedTimeSlotsNum] = useState('0');
  const [playoffTimeSlots, setPlayoffTimeSlots] = useState<
    ITimeSlot[] | undefined
  >();

  useEffect(() => {
    const data = getWarmupFromSchedule(schedules, selectedSchedule);
    setLocalWarmup(data);

    const schedule = schedules.find(
      item => item.schedule_id === selectedSchedule
    );

    if (!schedule || !event) return;

    const timeValues = getTimeValuesFromEventSchedule(event, schedule);
    const timeSlots: ITimeSlot[] = calculateTimeSlots(timeValues)!;

    const newPlayoffTimeSlots = predictPlayoffTimeSlots(
      fields,
      timeSlots,
      divisions,
      event!
    );

    setPlayoffTimeSlots(newPlayoffTimeSlots);
  }, [selectedSchedule]);

  const onChange = (e: InputTargetValue) => setBracketName(e.target.value);

  const alignItemsChange = () => setAlignItems(v => !v);
  const adjustTimeChange = () => setAdjustTime(v => !v);

  const onChangeSchedule = (e: InputTargetValue) =>
    setSelectedSchedule(e.target.value);

  const onChangeTimeBtwnPeriods = (e: InputTargetValue) => {
    const timeInMinutes = Number(e.target.value);
    const timeInString = timeToString(timeInMinutes);
    setLocalWarmup(timeInString);
  };

  const onClosePressed = () => {
    setModalPage(ModalPageEnum.chooseMode);
    setModeOptions(ModeOptionEnum['Use Scheduler']);
    setBracketName('');
    setSelectedSchedule('');
    setAlignItems(false);
    setAdjustTime(false);
    setLocalWarmup('00:00:00');
    onClose();
  };

  const onNextPressed = () => {
    setModalPage(ModalPageEnum.modalBody);
  };

  const onCreatePressed = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!event) {
      return errorToast(
        "Couldn't process the Bracket data. Please, try again."
      );
    }

    const eventId = event.event_id;
    const bracketDate = event.event_enddate;

    const firstTimeSlot = playoffTimeSlots?.length
      ? playoffTimeSlots[0].id
      : -1;
    const lastTimeSlot = playoffTimeSlots?.length
      ? playoffTimeSlots[playoffTimeSlots.length - 1].id
      : -1;

    const scheduleData: ICreateBracketModalOutput = {
      id: getVarcharEight(),
      name: bracketName,
      scheduleId: selectedSchedule,
      alignItems,
      adjustTime,
      bracketDate,
      eventId,
      startTimeSlot: String(firstTimeSlot),
      endTimeSlot: String(
        lastTimeSlot ? lastTimeSlot + +selectedTimeSlotsNum : lastTimeSlot
      ),
      warmup: localWarmup || '00:00:00',
      createDate: new Date().toISOString(),
      isManualCreation: mode === ModeOptionEnum['Create Manually'],
    };
    onCreateBracket(scheduleData);
  };

  const schedulesOptions = schedules.map(item => ({
    label: item.schedule_name!,
    value: item.schedule_id,
  }));

  const alignItemsOptions = [
    {
      label: 'Align Tourney Play games to the start of the Brackets',
      checked: alignItems,
      name: 'alignItems',
    },
  ];
  const adjustTimeOptions = [
    {
      label: 'Adjust time between games',
      checked: adjustTime,
      name: 'adjustTime',
    },
  ];

  const alignItemsTooltip =
    'Early morning TP games will be moved adjacent to brackets';
  const adjustTimeTooltip =
    'Provides a larger rest between games for advancing teams';

  const onModeChange = (e: InputTargetValue) => {
    setModeOptions(ModeOptions.findIndex(v => v === e.target.value));
  };

  const ChooseMode = () => (
    <div>
      <p className={styles.message}>
        Do you want to use 'Brackets Algorithm' or create brackets manually?
      </p>
      <div className={styles.radioBtnsWrapper}>
        <Radio
          options={ModeOptions}
          formLabel=""
          onChange={onModeChange}
          checked={ModeOptions[mode] || ''}
        />
      </div>
    </div>
  );

  const ModalBody = () => (
    <div className={styles.mainBody}>
      <div className={styles.inputsWrapper}>
        <Input
          width="230px"
          onChange={onChange}
          value={bracketName}
          autofocus={true}
          placeholder="Brackets Version Name"
        />
        <Select
          name="Name"
          width="230px"
          placeholder="Select Schedule"
          options={schedulesOptions}
          value={selectedSchedule}
          onChange={onChangeSchedule}
        />
      </div>
      <div className={styles.checkboxWrapper}>
        <Checkbox options={alignItemsOptions} onChange={alignItemsChange} />
        <Tooltip title={alignItemsTooltip} type={TooltipMessageTypes.INFO}>
          <div className={styles.tooltipIcon}>{getIcon(Icons.INFO)}</div>
        </Tooltip>
      </div>
      <div>
        <div className={styles.checkboxWrapper}>
          <Checkbox options={adjustTimeOptions} onChange={adjustTimeChange} />
          <Tooltip title={adjustTimeTooltip} type={TooltipMessageTypes.INFO}>
            <div className={styles.tooltipIcon}>{getIcon(Icons.INFO)}</div>
          </Tooltip>
        </div>
        <Input
          onChange={onChangeTimeBtwnPeriods}
          value={localWarmup ? getTimeFromString(localWarmup, 'minutes') : 0}
          width="150px"
          minWidth="50px"
          type="number"
          disabled={!(adjustTime && localWarmup)}
          endAdornment="Minutes"
        />
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClosePressed}>
      <div className={styles.wrapper}>
        <HeadingLevelFour>
          <span>Create Bracket</span>
        </HeadingLevelFour>
        {modalPage === ModalPageEnum.chooseMode ? (
          <ChooseMode />
        ) : (
          <ModalBody />
        )}
        <div className={styles.buttonsWrapper}>
          <Button
            label="Cancel"
            color="secondary"
            variant="text"
            onClick={onClosePressed}
          />
          {modalPage === ModalPageEnum.chooseMode ? (
            <Button
              label="Next"
              color="primary"
              variant="contained"
              onClick={onNextPressed}
            />
          ) : (
            <Button
              label="Create"
              color="primary"
              variant="contained"
              disabled={!bracketName || !selectedSchedule}
              onClick={onCreatePressed}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewBracket;
