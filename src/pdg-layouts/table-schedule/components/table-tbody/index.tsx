import React from 'react';
import { View } from '@react-pdf/renderer';
import RowTimeSlot from '../row-time-slot';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { selectProperGamesPerTimeSlot } from 'components/common/matrix-table/helper';

interface Props {
  facility: IScheduleFacility;
  timeSlots: ITimeSlot[];
  games: IGame[];
  splitIdx: number;
}

const TableTbody = ({ facility, timeSlots, games, splitIdx }: Props) => (
  <View>
    {timeSlots.map((timeSlot: ITimeSlot, idx) => (
      <RowTimeSlot
        games={selectProperGamesPerTimeSlot(timeSlot, games)}
        facility={facility}
        timeSlot={timeSlot}
        splitIdx={splitIdx}
        isEven={(idx + 1) % 2 === 0}
        key={timeSlot.id}
      />
    ))}
  </View>
);

export default TableTbody;
