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
    {timeSlots.map((timeSlot: ITimeSlot) => (
      <RowTimeSlot
        games={selectProperGamesPerTimeSlot(timeSlot, games)}
        facility={facility}
        timeSlot={timeSlot}
        splitIdx={splitIdx}
        key={timeSlot.id}
      />
    ))}
  </View>
);

export default TableTbody;
