import React from 'react';
import { View } from '@react-pdf/renderer';
import RowTimeSlot from '../row-time-slot';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { selectProperGamesPerTimeSlot } from 'components/common/matrix-table/helper';
import { DEFAUL_COLUMNS_COUNT } from '../../common';

interface Props {
  timeSlots: ITimeSlot[];
  games: IGame[];
  splitIdx: number;
  isHeatMap?: boolean;
}

const TableTbody = ({ timeSlots, games, splitIdx, isHeatMap }: Props) => {
  const timeSlotsWithGames = timeSlots.reduce((acc, timeSlot) => {
    const gamesPerTimeSlot = selectProperGamesPerTimeSlot(
      timeSlot,
      games
    ).slice(splitIdx, splitIdx + DEFAUL_COLUMNS_COUNT);

    const isEmptyTimeSlot = gamesPerTimeSlot.every(
      it => !it.awayTeam && !it.homeTeam
    );

    return isEmptyTimeSlot
      ? acc
      : [
          ...acc,
          <RowTimeSlot
            games={gamesPerTimeSlot}
            timeSlot={timeSlot}
            isEven={(acc.length + 1) % 2 === 0}
            isHeatMap={isHeatMap}
            key={timeSlot.id}
          />,
        ];
  }, [] as JSX.Element[]);

  return <View>{timeSlotsWithGames}</View>;
};

export default TableTbody;
