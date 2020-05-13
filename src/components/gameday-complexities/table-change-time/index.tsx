import React from 'react';
import RowChangeTime from '../row-change-time';
import ITimeSlot from 'common/models/schedule/timeSlots';
import styles from './styles.module.scss';
import { IChangedTimeSlot } from '../common';
import { BindingCbWithOne } from 'common/models';

interface Props {
  timeSlots: ITimeSlot[];
  changedTimeSlots: IChangedTimeSlot[];
  onChangeToChange: (timeSlot: IChangedTimeSlot, flag: boolean) => void;
  onChangeChangedTimeSlot: BindingCbWithOne<IChangedTimeSlot>;
}

const TableChangeTime = ({
  timeSlots,
  changedTimeSlots,
  onChangeToChange,
  onChangeChangedTimeSlot,
}: Props) => {
  if (!timeSlots?.length) {
    return null;
  }

  const getChanedTimeSlot = (timeSlot: ITimeSlot) => {
    const changedTimeSlot = changedTimeSlots.find(
      it => it.timeSlotTime === timeSlot.time
    );

    return changedTimeSlot;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Existing Time Slots</th>
            <th>Time Slot Impacted</th>
            <th>New Suggested Time Slots</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(it => (
            <RowChangeTime
              timeSlot={it}
              chanedTimeSlot={getChanedTimeSlot(it)}
              onChangeChangedTimeSlot={onChangeChangedTimeSlot}
              onChangeToChange={onChangeToChange}
              key={it.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableChangeTime;
