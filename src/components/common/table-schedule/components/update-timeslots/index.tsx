import React, { useState } from 'react';
import { ISchedulesDetails, ISelectOption } from 'common/models';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { TimeSlotsEntityTypes } from 'common/enums';
import { getTimeSlotsFromEntities } from 'helpers/schedule.helpers';
import { timeToDate, dateToTime } from 'helpers/date.helper';
import { Select, DatePicker, PopupConfirm, Button } from 'components/common';
import styles from './styles.module.scss';
import moment from 'moment';

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
  const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false);

  const dates = [
    ...new Set(
      schedulesDetails.filter(v => v.game_date !== null).map(v => v.game_date)
    ),
  ];

  const filterScheduleDetailsByDate = (dateId: string) => {
    return schedulesDetails.filter(v => v.game_date === dates[+dateId - 1]);
  };

  const mapDatesToOptions = () => {
    return dates.map((v, i) => ({
      value: i + 1,
      label: moment(v || '').format('ddd MMM D'),
    })) as ISelectOption[];
  };

  const mapTimeSlotsToOptions = () => {
    return selectedDateTimeSlots.map(v => ({
      value: v.id + 1,
      label: moment(timeToDate(v.time))
        .locale('en')
        .format('hh:mm A'),
    }));
  };

  const onDateChange = (e: any) => {
    const selectedDateFromSelect = e.target.value;
    setSelectedDateId(selectedDateFromSelect);
    setSelectedDateTimeSlots(
      getTimeSlotsFromEntities(
        filterScheduleDetailsByDate(selectedDateFromSelect),
        TimeSlotsEntityTypes.SCHEDULE_DETAILS
      )
    );
  };

  const onTimeSlotChange = (e: any) => {
    const selectedTime = e.target.value;
    setSelectedTimeSlotId((selectedTime - 1).toString());
    const timeslot = new Date(
      timeToDate(
        selectedDateTimeSlots.find(v => v.id === selectedTime - 1)?.time || '')
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

    const filteredSchedulesDetailsByDate = filterScheduleDetailsByDate(selectedDateId);

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
        const newDetail = { ...detail };
        if (newDetail.game_time && changingTimeSlots.includes(newDetail.game_time)) {
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

  const closeWarning = () => setIsOpenWarning(false);
  const closeConfirmation = () => setIsOpenConfirmation(false);

  const openConfirmationPopup = () => setIsOpenConfirmation(true);
  const onPopupConfirm = () => {
    updateTimeSlots();
    closeConfirmation();
  };

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
          label="Change Timeslot:"
          onChange={onTimeChange}
          disabled={!selectedTimeSlotId}
        />
        <div className={styles.btnsWrapper}>
          <Button
            label="Save"
            variant="contained"
            color="primary"
            onClick={openConfirmationPopup}
            disabled={!newTimeSlot}
          />
        </div>
      </div>

      <PopupConfirm
        type="warning"
        isOpen={isOpenWarning}
        message="Something is wrong. Please check your times."
        onClose={closeWarning}
        onCanceClick={closeWarning}
        onYesClick={closeWarning}
      />

      <PopupConfirm
        isOpen={isOpenConfirmation}
        message="Game time is outside of the event's time window. Are you sure?"
        onClose={closeConfirmation}
        onCanceClick={closeConfirmation}
        onYesClick={onPopupConfirm}
      />
    </div>
  );
};

export default UpdateTimeSlots;
