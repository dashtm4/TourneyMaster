import React, { useState } from 'react';
import { ISchedulesDetails } from 'common/models';
import { Select, DatePicker, PopupConfirm, Button } from 'components/common';
import { getTimeSlotsFromEntities } from 'helpers/schedule.helpers';
import { TimeSlotsEntityTypes } from 'common/enums';
import { timeToDate, dateToTime } from 'helpers/date.helper';
import styles from './styles.module.scss';
import ITimeSlot from 'common/models/schedule/timeSlots';

interface Props {
  schedulesDetails: ISchedulesDetails[];
  updateSchedulesDetails: (
    modifiedSchedulesDetails: ISchedulesDetails[],
    schedulesDetailsToModify: ISchedulesDetails[]
  ) => void;
}

const UpdateTimeslots = ({ schedulesDetails, updateSchedulesDetails }: Props) => {
  const [selectedDateId, setSelectedDateId] = useState('');
  const [selectedDateTimeslots, setSelectedDateTimeslots] = useState<
    ITimeSlot[]
  >([]);
  const [selectedDateTimeslotId, setSelectedDateTimeslotId] = useState('');
  const [selectedDateTimeslot, setSelectedDateTimeslot] = useState<Date>(
    new Date()
  );
  const [selectedTimeDifference, setSelectedTimeDifference] = useState<number>(
    0
  );
  const [inputedTimeslot, setInputedTimeslot] = useState<Date>();
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const dates = [
    ...new Set(
      schedulesDetails
        ?.filter(item => item.game_date !== null)
        .map(item => item.game_date)
    ),
  ] as string[];

  const cancel = () => setIsOpenWarning(false);

  const onDateChange = (e: any) => {
    const selectedDateFromSelect = e.target.value;
    setSelectedDateId(selectedDateFromSelect);
    setSelectedDateTimeslots(
      getTimeSlotsFromEntities(
        schedulesDetails.filter(
          item => item.game_date === dates[+selectedDateFromSelect - 1]
        ),
        TimeSlotsEntityTypes.SCHEDULE_DETAILS
      )
    );
  };

  const onTimeslotChange = (e: any) => {
    const selectedTimeslotFromSelect = e.target.value;
    setSelectedDateTimeslotId((selectedTimeslotFromSelect - 1).toString());
    const timeslot = new Date(
      timeToDate(
        selectedDateTimeslots?.find(
          item => item.id === selectedTimeslotFromSelect - 1
        )?.time || ''
      )
    );
    setSelectedDateTimeslot(timeslot);
    setInputedTimeslot(timeslot);
  };

  const onTimeChange = (time: Date) => {
    const timeDifference = +time - +selectedDateTimeslot;
    if (timeDifference < 0) {
      setIsOpenWarning(true);
      return;
    }
    setSelectedTimeDifference(timeDifference);
    setInputedTimeslot(time);
  };

  const updateTimeSlots = () => {
    const changingTimeslots = selectedDateTimeslots.slice(+selectedDateTimeslotId).map(timeslot => timeslot.time);
    const filteredSchedulesDetailsByDate = schedulesDetails ?.filter(
      item => item.game_date === dates[+selectedDateId - 1]
    );
    const swapMap = changingTimeslots.map(slot => {
      return { prevTimeslot: slot, nextTimeslot: dateToTime(new Date(+(new Date(timeToDate(slot))) + selectedTimeDifference)) }
    });
    const updatedFilteredSchedulesDetails = filteredSchedulesDetailsByDate.map(
      detail => {
        if (
          changingTimeslots.includes(detail.game_time || '') &&
          detail.game_time
        ) {
          const time = swapMap.find(
            item => item.prevTimeslot === detail.game_time
          );
          detail.game_time = time ? time.nextTimeslot : detail.game_time;
        }
        return detail;
      }
    );
    const updatedFilteredSchedulesDetailsIds = updatedFilteredSchedulesDetails.map(detail => {
      return { id: detail.schedule_version_id, value: detail};
    });
    const updatedSchedulesDetails = schedulesDetails.map(detail => {
      const itemForChange = updatedFilteredSchedulesDetailsIds.find((o) => o.id === detail.schedule_version_id);
      if (itemForChange) {
        detail = itemForChange.value;
      }
      return detail;
    });

    // console.log(updatedSchedulesDetails, updatedFilteredSchedulesDetails);
    updateSchedulesDetails(updatedSchedulesDetails, updatedFilteredSchedulesDetails);
  };

  return (
    <div>
      <div className={styles.selectContainer}>
        <div className={styles.selectWrapper}>
          <Select
            options={dates.map((v, index) => {
              return { value: index + 1, label: v };
            })}
            label="Select Date:"
            value={selectedDateId}
            onChange={onDateChange}
          />
        </div>
        <div className={styles.selectWrapper}>
          <Select
            options={selectedDateTimeslots.map(timeslot => {
              return { value: timeslot.id + 1, label: timeslot.time };
            })}
            value={(+selectedDateTimeslotId + 1).toString()}
            label="Select Timeslot:"
            onChange={onTimeslotChange}
            disabled={!selectedDateId}
          />
        </div>
      </div>
      <div className={styles.flexcontainer}>
        <DatePicker
          minWidth="calc(100% - 40px)"
          value={inputedTimeslot}
          type="time"
          viewType="input"
          label="Change Timeslot:"
          onChange={onTimeChange}
          disabled={!selectedDateTimeslotId}
        />
        <div className={styles.btnsWrapper}>
          <Button
            label="Save"
            variant="contained"
            color="primary"
            onClick={updateTimeSlots}
            disabled={!inputedTimeslot}
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

export default UpdateTimeslots;
