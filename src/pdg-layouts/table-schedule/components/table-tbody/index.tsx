import React from 'react';
import { View } from '@react-pdf/renderer';
import RowTimeSlot from '../row-time-slot';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';

interface Props {
  facility: IScheduleFacility;
  timeSlots: ITimeSlot[];
  games: IGame[];
  splitIdx: number;
  isHeatMap?: boolean;
}

const TableTbody = ({
  facility,
  timeSlots,
  games,
  splitIdx,
  isHeatMap,
}: Props) => (
  <View>
    {timeSlots.map((timeSlot: ITimeSlot, idx) => {
      const gamesPerTimeSlot = games.filter(
        (game: IGame) =>
          game.timeSlotId === timeSlot.id && game.facilityId === facility.id
      );

      return (
        <RowTimeSlot
          games={gamesPerTimeSlot}
          timeSlot={timeSlot}
          splitIdx={splitIdx}
          isEven={(idx + 1) % 2 === 0}
          isHeatMap={isHeatMap}
          key={timeSlot.id}
        />
      );
    })}
  </View>
);

export default TableTbody;
