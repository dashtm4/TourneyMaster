import React, { useEffect, useState } from 'react';
import { ISchedulesDetails, ISelectOption } from 'common/models';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { TimeSlotsEntityTypes } from 'common/enums';
import { getTimeSlotsFromEntities } from 'helpers/schedule.helpers';
import { timeToDate, dateToTime } from 'helpers/date.helper';
import { Select, DatePicker, PopupConfirm, Button, Checkbox } from 'components/common';
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
  const [timeShift, setTimeShift] = useState<number>(0);
  const [newTimeSlot, setNewTimeSlot] = useState<Date>();
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false);
  const [doShiftAllSubsequentGames, setDoShiftAllSubsequentGames] = useState<boolean>(false);
  const [messageForWarning, setMessageForWarning] = useState("The new time can't be earlier than the selected timeslot.");

  useEffect(() => {
    fillTimeSlotsSelect(selectedDateId);
  }, [schedulesDetailsToState]);

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
    const selectedTimeslotId = e.target.value;
    setSelectedTimeSlotId(selectedTimeslotId);
    setNewTimeSlot(selectedTimeslotIdToDate(selectedTimeslotId));
  };

  const selectedTimeslotIdToDate = (timeslotId: string) => {
    const selectedTimeslot = selectedDateTimeSlots.find(v => v.id === +timeslotId - 1);
    if (!selectedTimeslot) {
      return;
    }
    const time = selectedTimeslot.time;
    return new Date(timeToDate(time));
  };

  const onTimeChange = (time: Date) => {
    const minutes = time.getMinutes();
    const remainder = minutes % 5;
    time.setMinutes(remainder >= 3 ? minutes + (5 - remainder) : minutes - remainder);
    const currentTimeSlotValue = Date.parse(time.toDateString() + ' ' + selectedDateTimeSlots.find(v => v.id === +selectedTimeSlotId - 1)!.time);
    const timeDifference = +time - +currentTimeSlotValue;

    const prevTimeslot = selectedDateTimeSlots.find(v => v.id === +selectedTimeSlotId - 2);
    const nextTimeslot = selectedDateTimeSlots.find(v => v.id === +selectedTimeSlotId);
    let prevTimeSlotValue;
    let nextTimeSlotValue;
    if (prevTimeslot) {
      prevTimeSlotValue = Date.parse(time.toDateString() + ' ' + prevTimeslot.time);
    }
    if (nextTimeslot) {
      nextTimeSlotValue = Date.parse(time.toDateString() + ' ' + nextTimeslot.time);
    }

    if (doShiftAllSubsequentGames && timeDifference < 0) {
      setMessageForWarning("The new time can't be earlier than the selected timeslot.");
      setIsOpenWarning(true);
      return;
    } else {
      if (!prevTimeslot && nextTimeSlotValue && +time >= nextTimeSlotValue) {
        setMessageForWarning(`Time should be less than ${nextTimeslot!.time}`);
        setIsOpenWarning(true);
        return;
      }
      if (!nextTimeslot && prevTimeSlotValue && +time <= prevTimeSlotValue) {
        setMessageForWarning(`Time should be more than ${prevTimeslot!.time}`);
        setIsOpenWarning(true);
        return;
      }

      if (nextTimeSlotValue && prevTimeSlotValue && (+time <= prevTimeSlotValue || +time >= nextTimeSlotValue)) {
        setMessageForWarning(`Time should be between ${prevTimeslot!.time} and ${nextTimeslot!.time}`);
        setIsOpenWarning(true);
        return;
      }
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
  };

  const onShiftOptionChange = () => {
    setDoShiftAllSubsequentGames(!doShiftAllSubsequentGames);
    setNewTimeSlot(selectedTimeslotIdToDate(selectedTimeSlotId));
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
      <div className={styles.flexCol}>
        <div className={styles.flexcontainer}>
          <p>Change Timeslot:</p>
          <DatePicker
            value={newTimeSlot}
            type="time"
            viewType="input"
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

        <Checkbox
          options={[
            {
              label: 'Shift all subsequent games',
              checked: doShiftAllSubsequentGames,
            },
          ]}
          onChange={onShiftOptionChange}
        />
      </div>

      <PopupConfirm
        isOpen={isOpenWarning}
        message={messageForWarning}
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
