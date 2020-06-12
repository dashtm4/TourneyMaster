import React, { useState } from 'react';
import { ISchedulesDetails, ISelectOption } from 'common/models';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { TimeSlotsEntityTypes } from 'common/enums';
import { getTimeSlotsFromEntities } from 'helpers/schedule.helpers';
import { timeToDate, dateToTime } from 'helpers/date.helper';
import { Select, DatePicker, PopupConfirm, Button } from 'components/common';
import styles from './styles.module.scss';

interface Props {
  schedulesDetails: ISchedulesDetails[];
  updateSchedulesDetails: (
    modifiedSchedulesDetails: ISchedulesDetails[],
    schedulesDetailsToModify: ISchedulesDetails[]
  ) => void;
}

const UpdateTimeSlots = ({ schedulesDetails, updateSchedulesDetails }: Props) => {
  const [selectedDateId, setSelectedDateId] = useState('');
  const [selectedDateTimeSlots, setSelectedDateTimeSlots] = useState<ITimeSlot[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date>(new Date());
  const [timeShift, setTimeShift] = useState<number>(0);
  const [newTimeSlot, setNewTimeSlot] = useState<Date>();
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const dates = [...new Set(schedulesDetails
        .filter(v => v.game_date !== null)
        .map(v => v.game_date)
    )
  ];

  const mapDatesToOptions = () => dates.map((v, i) => ({ value: i + 1, label: v })) as ISelectOption[];

  const onDateChange = (e: any) => {
    const selectedDateFromSelect = e.target.value;
    setSelectedDateId(selectedDateFromSelect);
    setSelectedDateTimeSlots(
      getTimeSlotsFromEntities(
        schedulesDetails.filter(v => v.game_date === dates[+selectedDateFromSelect - 1]),
        TimeSlotsEntityTypes.SCHEDULE_DETAILS
      )
    );
  };

  const mapTimeSlotsToOptions = () => selectedDateTimeSlots.map(v => ({ value: v.id + 1, label: v.time }));

  const onTimeSlotChange = (e: any) => {
    const selectedTimeSlotFromSelect = e.target.value;
    setSelectedTimeSlotId((selectedTimeSlotFromSelect - 1).toString());
    const timeslot = new Date(
      timeToDate(selectedDateTimeSlots.find(v => v.id === selectedTimeSlotFromSelect - 1)?.time || '')
    );
    setSelectedTimeSlot(timeslot);
    setNewTimeSlot(timeslot);
  };

  const onTimeChange = (time: Date) => {
    const timeDifference = +time - +selectedTimeSlot;
    if (timeDifference < 0) {
      setIsOpenWarning(true);
      return;
    }
    setTimeShift(timeDifference);
    setNewTimeSlot(time);
  };

  const updateTimeSlots = () => {
    const changingTimeSlots = selectedDateTimeSlots
      .slice(+selectedTimeSlotId)
      .map(timeslot => timeslot.time);

    const filteredSchedulesDetailsByDate = schedulesDetails.filter(v => v.game_date === dates[+selectedDateId - 1]);

    const swapMap = changingTimeSlots.map(slot => {
      return {
        prevTimeSlot: slot,
        nextTimeSlot: dateToTime(
          new Date(+new Date(timeToDate(slot)) + timeShift)
        ),
      };
    });

    const updatedFilteredSchedulesDetails = filteredSchedulesDetailsByDate.map(
      detail => {
        const newDetail = { ...detail }
        if (changingTimeSlots.includes(newDetail.game_time || '') && newDetail.game_time) {
          const time = swapMap.find(v => v.prevTimeSlot === newDetail.game_time);
          newDetail.game_time = time ? time.nextTimeSlot : newDetail.game_time;
        }
        return newDetail;
      }
    );

    const updatedFilteredSchedulesDetailsWithIds = updatedFilteredSchedulesDetails.map(v => ({ id: v.schedule_version_id, value: v }));

    const updatedSchedulesDetails = schedulesDetails.map(detail => {
      const itemForChange = updatedFilteredSchedulesDetailsWithIds.find(detailWithID => detailWithID.id === detail.schedule_version_id);
      if (itemForChange) {
        return itemForChange.value;
      }
      return detail;
    });

    updateSchedulesDetails(updatedSchedulesDetails, updatedFilteredSchedulesDetails);
  };

  const cancel = () => setIsOpenWarning(false);

  return (
    <div>
      <div className={styles.selectContainer}>
        <div className={styles.selectWrapper}>
          <Select
            options={mapDatesToOptions()}
            label="Select Date:"
            value={selectedDateId}
            onChange={onDateChange}
          />
        </div>
        <div className={styles.selectWrapper}>
          <Select
            options={mapTimeSlotsToOptions()}
            value={(+selectedTimeSlotId + 1).toString()}
            label="Select Timeslot:"
            onChange={onTimeSlotChange}
            disabled={!selectedDateId}
          />
        </div>
      </div>
      <div className={styles.flexcontainer}>
        <DatePicker
          minWidth="calc(100% - 40px)"
          value={newTimeSlot}
          type="time"
          viewType="input"
          label="Change Timeslot:"
          onChange={onTimeChange}
          disabled={!selectedTimeSlotId}
        />
        <div className={styles.btnsWrapper}>
          <Button
            label="Save"
            variant="contained"
            color="primary"
            onClick={updateTimeSlots}
            disabled={!newTimeSlot}
          />
        </div>
      </div>

      <PopupConfirm
        type="warning"
        isOpen={isOpenWarning}
        message={'Not correct'}
        onClose={cancel}
        onCanceClick={cancel}
        onYesClick={cancel}
      />
    </div>
  );
};

export default UpdateTimeSlots;
