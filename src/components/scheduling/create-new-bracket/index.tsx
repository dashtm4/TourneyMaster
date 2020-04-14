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
} from 'components/common';
import styles from './styles.module.scss';
import { ISchedule } from 'common/models';
import { getTimeFromString, timeToString, getIcon } from 'helpers';
import { Icons } from 'common/enums';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

export interface ICreateBracketModalOutput {
  name: string;
  scheduleId: string;
  alignItems: boolean;
  adjustTime: boolean;
  warmup: string;
}

interface IProps {
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
  const { isOpen, onClose, schedules, onCreateBracket } = props;
  const [bracketName, setBracketName] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [alignItems, setAlignItems] = useState(false);
  const [adjustTime, setAdjustTime] = useState(false);
  const [localWarmup, setLocalWarmup] = useState(
    getWarmupFromSchedule(schedules, selectedSchedule)
  );

  useEffect(() => {
    const data = getWarmupFromSchedule(schedules, selectedSchedule);
    setLocalWarmup(data);
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
    setBracketName('');
    setSelectedSchedule('');
    setAlignItems(false);
    setAdjustTime(false);
    setLocalWarmup('00:00:00');
    onClose();
  };

  const onCreatePressed = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const scheduleData = {
      name: bracketName,
      scheduleId: selectedSchedule,
      alignItems,
      adjustTime,
      warmup: localWarmup || '00:00:00',
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

  return (
    <Modal isOpen={isOpen} onClose={onClosePressed}>
      <div className={styles.wrapper}>
        <HeadingLevelFour>
          <span>Create Bracket</span>
        </HeadingLevelFour>
        <div className={styles.mainBody}>
          <div className={styles.inputsWrapper}>
            <Input
              width="220px"
              onChange={onChange}
              value={bracketName}
              autofocus={true}
              placeholder="Brackets Version Name"
            />
            <Select
              name="Name"
              width="220px"
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
              <Checkbox
                options={adjustTimeOptions}
                onChange={adjustTimeChange}
              />
              <Tooltip
                title={adjustTimeTooltip}
                type={TooltipMessageTypes.INFO}
              >
                <div className={styles.tooltipIcon}>{getIcon(Icons.INFO)}</div>
              </Tooltip>
            </div>
            <Input
              onChange={onChangeTimeBtwnPeriods}
              value={
                localWarmup ? getTimeFromString(localWarmup, 'minutes') : 0
              }
              width="70px"
              minWidth="50px"
              type="number"
              disabled={!(adjustTime && localWarmup)}
            />
          </div>
        </div>
        <div className={styles.buttonsWrapper}>
          <Button
            label="Cancel"
            color="secondary"
            variant="text"
            onClick={onClosePressed}
          />
          <Button
            label="Create"
            color="primary"
            variant="contained"
            disabled={!bracketName || !selectedSchedule}
            onClick={onCreatePressed}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewBracket;
