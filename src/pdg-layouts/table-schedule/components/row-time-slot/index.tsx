import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot } from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { styles } from './styles';

const EVEN_COLOR = '#DCDCDC';

interface Props {
  facility: IScheduleFacility;
  timeSlot: ITimeSlot;
  games: IGame[];
  isEven: boolean;
  splitIdx: number;
}

const RowTimeSlot = ({
  facility,
  timeSlot,
  games,
  isEven,
  splitIdx,
}: Props) => (
  <View style={styles.timeSlotRow} wrap={false} key={timeSlot.id}>
    <Text
      style={{ ...styles.timeSlot, backgroundColor: isEven ? EVEN_COLOR : '' }}
    >
      {formatTimeSlot(timeSlot.time)}
    </Text>
    {games
      .reduce((acc, game) => {
        return game.facilityId === facility.id
          ? [
              ...acc,
              <View
                style={{
                  ...styles.gameWrapper,
                  backgroundColor: isEven ? EVEN_COLOR : '',
                }}
                key={game.id}
              >
                <Text style={styles.gameTeamName}>
                  {game.awayTeam?.name &&
                    `${game.awayTeam?.name} (${game.awayTeam?.divisionShortName})`}
                </Text>
                <Text style={styles.gameTeamName}>
                  {game.homeTeam?.name &&
                    `${game.homeTeam?.name} (${game.homeTeam?.divisionShortName})`}
                </Text>
              </View>,
            ]
          : acc;
      }, [] as JSX.Element[])
      .slice(splitIdx, splitIdx + 8)}
  </View>
);

export default RowTimeSlot;
