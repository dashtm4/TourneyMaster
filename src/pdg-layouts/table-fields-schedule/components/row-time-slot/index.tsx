import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { formatTimeSlot } from 'helpers';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { styles } from './styles';

const EVEN_COLOR = '#DCDCDC';

interface Props {
  timeSlot: ITimeSlot;
  games: IGame[];
  isEven: boolean;
}

const RowTimeSlot = ({ timeSlot, games, isEven }: Props) => (
  <View
    style={{
      ...styles.rowTimeSlot,
      backgroundColor: isEven ? EVEN_COLOR : '',
    }}
  >
    <Text style={styles.timeSlot}>{formatTimeSlot(timeSlot.time)}</Text>
    {games.map(game => (
      <View style={styles.gamesWrapper} key={game.id}>
        <Text style={styles.team}>
          {game.awayTeam?.name &&
            `${game.awayTeam?.name} (${game.awayTeam?.divisionShortName})`}
        </Text>
        <Text style={styles.team}>
          {game.homeTeam?.name &&
            `${game.homeTeam?.name} (${game.homeTeam?.divisionShortName})`}
        </Text>
      </View>
    ))}
    <View style={styles.scoresWrapper}>
      <View style={styles.scores} />
      <View style={styles.scores} />
    </View>
    <View style={styles.initials} />
  </View>
);

export default RowTimeSlot;
