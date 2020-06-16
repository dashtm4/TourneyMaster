import React, { useEffect, useRef, useState } from 'react';
import { ISchedulesDetails, ISelectOption } from 'common/models';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { TimeSlotsEntityTypes } from 'common/enums';
import { getTimeSlotsFromEntities } from 'helpers/schedule.helpers';
import { timeToDate, dateToTime } from 'helpers/date.helper';
import { Select, DatePicker, PopupConfirm, Button } from 'components/common';
import styles from './styles.module.scss';
import moment from 'moment';

interface IProps {
  schedulesDetails: ISchedulesDetails[];
  onScheduleGameUpdate: (gameId: number, gameTime: string) => void;
  updateSchedulesDetails: (
    modifiedSchedulesDetails: ISchedulesDetails[],
    schedulesDetailsToModify: ISchedulesDetails[]
  ) => void;
}

const UpdateTimeSlots = ({
  schedulesDetails,
  onScheduleGameUpdate,
  updateSchedulesDetails,
}: IProps) => {
  const [schedulesDetailsToState, setSchedulesDetailsToState] = useState<ISchedulesDetails[]>(schedulesDetails);
  const [selectedDateId, setSelectedDateId] = useState('');
  const [selectedDateTimeSlots, setSelectedDateTimeSlots] = useState<ITimeSlot[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date>(new Date());
  const [timeShift, setTimeShift] = useState<number>(0);
  const [newTimeSlot, setNewTimeSlot] = useState<Date>();
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false);

  const needUpdateTimeSlots = useRef(true);

  useEffect(() => {
    if (needUpdateTimeSlots.current) {
      fillTimeSlotsSelect(selectedDateId);
      needUpdateTimeSlots.current = false;
    }
  });

  const dates = [
    ...new Set(
      schedulesDetails.filter(v => v.game_date !== null).map(v => v.game_date)
    ),
  ];

  const fillTimeSlotsSelect = (selectedDateIndex: string) => {
    setSelectedDateTimeSlots(
      getTimeSlotsFromEntities(
        filterScheduleDetailsByDate(selectedDateIndex),
        TimeSlotsEntityTypes.SCHEDULE_DETAILS
      )
    );
  };

  const filterScheduleDetailsByDate = (dateId: string) => {
    return schedulesDetailsToState.filter(v => v.game_date === dates[+dateId - 1]);
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
    fillTimeSlotsSelect(selectedDateFromSelect);
  };

  const onTimeSlotChange = (e: any) => {
    const selectedTime = e.target.value;
    setSelectedTimeSlotId(selectedTime);
    const timeslot = new Date(
      timeToDate(
        selectedDateTimeSlots.find(v => v.id === selectedTime - 1)?.time || '')
    );
    setSelectedTimeSlot(timeslot);
    setNewTimeSlot(timeslot);
  };

  const onTimeChange = (time: Date) => {
    const timeDifference = +time - +selectedTimeSlot;
    if (timeDifference === 0) {
      return;
    }
    if (timeDifference < 0) {
      setIsOpenWarning(true);
      return;
    }
    setTimeShift(timeDifference);
    setNewTimeSlot(time);
  };

  const updateTimeSlots = () => {
    const changingTimeSlots = selectedDateTimeSlots
      .slice(+selectedTimeSlotId - 1)
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

    const schedulesDetailsToSave = filteredSchedulesDetailsByDate.map(
      detail => {
        const newDetail = { ...detail };
        if (newDetail.game_time && changingTimeSlots.includes(newDetail.game_time)) {
          const time = swapMap.find(v => v.prevTimeSlot === newDetail.game_time);
          newDetail.game_time = time ? time.nextTimeSlot : newDetail.game_time;
          onScheduleGameUpdate(+newDetail.game_id, newDetail.game_time);
        }
        return newDetail;
      }
    );

    const detailsToState = schedulesDetails.map(detail => {
      const itemForChange = schedulesDetailsToSave.find(
        o => o.schedule_version_id === detail.schedule_version_id
      );
      return itemForChange ? itemForChange : detail;
    });
    setSchedulesDetailsToState(detailsToState);
    updateSchedulesDetails(detailsToState, schedulesDetailsToSave);
  };

  const closeWarning = () => setIsOpenWarning(false);
  const closeConfirmation = () => setIsOpenConfirmation(false);

  const openConfirmationPopup = () => setIsOpenConfirmation(true);
  const onPopupConfirm = () => {
    updateTimeSlots();
    closeConfirmation();
    needUpdateTimeSlots.current = true;
  };

  return (
    <div>
      <div className={styles.selectContainer}>
        <div className={styles.selectWrapper}>
          <Select
            options={mapDatesToOptions()}
            placeholder="Select Date"
            value={selectedDateId}
            onChange={onDateChange}
          />
        </div>
        <div className={styles.selectWrapper}>
          <Select
            placeholder="Select Timeslot"
            options={mapTimeSlotsToOptions()}
            value={selectedTimeSlotId}
            onChange={onTimeSlotChange}
            disabled={!selectedDateId}
          />
        </div>
      </div>
      <div className={styles.flexcontainer}>
        <p>Change Timeslot:</p>
        <DatePicker
          value={newTimeSlot}
          type="time"
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
        isOpen={isOpenWarning}
        message="The new time can't be earlier than the selected timeslot."
        onClose={closeWarning}
        onCanceClick={closeWarning}
        showYes={false}
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
