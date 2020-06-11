import React, { useState } from 'react';
import { ISchedulesDetails } from 'common/models';
import { Select, DatePicker, PopupConfirm } from 'components/common';
import { getTimeSlotsFromEntities } from 'helpers/schedule.helpers';
import { TimeSlotsEntityTypes } from 'common/enums';
import { timeToDate, compareTime } from 'helpers/date.helper';
// import styles from './styles.module.scss';

interface Props {
  schedulesDetails: ISchedulesDetails[] | undefined;
}

const UpdateTimeslots = ({ schedulesDetails }: Props) => {
  const [selectedDateId, setSelectedDateId] = useState('');
  const [selectedDateTimeslots, setSelectedDateTimeslots] = useState([
    { id: 0, time: '' },
  ]);
  const [selectedDateTimeslotId, setSelectedDateTimeslotId] = useState();
  const [selectedDateTimeslot, setSelectedDateTimeslot] = useState<
    Date | string
  >();
  // const [selectedTimeDifference, setSelectedTimeDifference] = useState<
  //   number
  // >();

  const onTimeslotChange = (e: any) => {
    const selectedTimeslotFromSelect = e.target.value;
    setSelectedDateTimeslotId(selectedTimeslotFromSelect);
    setSelectedDateTimeslot(
      timeToDate(
        selectedDateTimeslots.find(
          item => item.id === selectedTimeslotFromSelect
        )?.time || ''
      )
    );
  };

  const cancel = () => console.log("yes");

  const onDateChange = (e: any) => {
    const selectedDateFromSelect = e.target.value;
    setSelectedDateId(selectedDateFromSelect);
    setSelectedDateTimeslots(
      getTimeSlotsFromEntities(
        schedulesDetails?.filter(
          item => item.game_date === dates[+selectedDateFromSelect - 1]
        ) || [],
        TimeSlotsEntityTypes.SCHEDULE_DETAILS
      )
    );
  };

  const onTimeChange = (time: string) => {
    // setSelectedTimeDifference(
    compareTime(time, selectedDateTimeslot?.toString() || '')
    // );
  };

  const dates = [
    ...new Set(
      schedulesDetails
        ?.filter(item => item.game_date !== null)
        .map(item => item.game_date)
    ),
  ] as string[];

  return (
    <div>
      <Select
        options={dates.map((v, index) => {
          return { value: index + 1, label: v };
        })}
        value={selectedDateId || ''}
        placeholder="Select Date"
        onChange={onDateChange}
      />
      <Select
        options={selectedDateTimeslots.map(timeslot => {
          return { value: timeslot.id, label: timeslot.time };
        })}
        value={selectedDateTimeslotId || ''}
        placeholder="Select timeslot"
        onChange={onTimeslotChange}
      />
      <DatePicker
        minWidth="100%"
        value="selectedDateTimeslotId"
        label="Change timeslot"
        type="time"
        onChange={onTimeChange}
      />
      <PopupConfirm
        type="warning"
        showYes={false}
        isOpen={false}
        message={'Not correct'}
        onClose={cancel}
        onCanceClick={cancel}
        onYesClick={cancel}
      />
    </div>
  );
};

export default UpdateTimeslots;
