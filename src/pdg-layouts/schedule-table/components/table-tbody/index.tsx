import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot } from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { selectProperGamesPerTimeSlot } from 'components/common/matrix-table/helper';
import { styles } from './styles';

interface Props {
  facility: IScheduleFacility;
  timeSlots: ITimeSlot[];
  games: IGame[];
  splitIdx: number;
}

const TableTbody = ({ facility, timeSlots, games, splitIdx }: Props) => (
  <View style={styles.tbody}>
    {timeSlots.map((timeSlot: ITimeSlot) => (
      <View style={styles.timeSlotRow} wrap={false} key={timeSlot.id}>
        <Text style={styles.timeSlot}>{formatTimeSlot(timeSlot.time)}</Text>
        {selectProperGamesPerTimeSlot(timeSlot, games)
          .reduce((acc, game) => {
            return game.facilityId === facility.id
              ? [
                  ...acc,
                  <View style={styles.gameWrapper} key={game.id}>
                    <Text style={styles.gameTeamName}>
                      {game.awayTeam?.name &&
                        `${game.awayTeam?.name}(${game.awayTeam?.divisionShortName})`}
                    </Text>
                    <Text style={styles.gameTeamName}>
                      {game.homeTeam?.name &&
                        `${game.homeTeam?.name}(${game.homeTeam?.divisionShortName})`}
                    </Text>
                  </View>,
                ]
              : acc;
          }, [] as JSX.Element[])
          .slice(splitIdx, splitIdx + 4)}
      </View>
    ))}
  </View>
);

export default TableTbody;
