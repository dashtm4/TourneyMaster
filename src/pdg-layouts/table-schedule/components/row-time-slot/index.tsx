import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot, getDivisionCutName } from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { DEFAUL_COLUMNS_COUNT } from '../../common';
import { styles } from './styles';
import { getContrastingColor } from '../../../../components/common/matrix-table/helper';

const EVEN_COLOR = '#DCDCDC';

interface Props {
  facility: IScheduleFacility;
  timeSlot: ITimeSlot;
  games: IGame[];
  isEven: boolean;
  splitIdx: number;
  isHeatMap?: boolean;
}

const RowTimeSlot = ({
  facility,
  timeSlot,
  games,
  isEven,
  splitIdx,
  isHeatMap,
}: Props) => {
  const getTeamColorStyles = (team: ITeamCard) => ({
    backgroundColor: isHeatMap ? team.divisionHex : '',
    color: isHeatMap ? getContrastingColor(team.divisionHex) : '#000000',
  });

  const getTeam = (team: ITeamCard) => (
    <View
      style={{
        ...styles.gameTeamName,
        ...getTeamColorStyles(team),
      }}
    >
      <Text style={styles.teamNameWrapper}>{team.name}</Text>
      <Text style={styles.divisionNameWrapper}>
        {` (${getDivisionCutName(team.divisionShortName!)})`}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        ...styles.timeSlotRow,
        backgroundColor: !isHeatMap && isEven ? EVEN_COLOR : '',
      }}
      wrap={false}
      key={timeSlot.id}
    >
      <Text style={styles.timeSlot}>{formatTimeSlot(timeSlot.time)}</Text>
      {games
        .reduce((acc, game) => {
          return game.facilityId === facility.id
            ? [
                ...acc,
                <View style={styles.gameWrapper} key={game.id}>
                  {game.awayTeam && game.homeTeam && (
                    <>
                      {getTeam(game.awayTeam)}
                      {getTeam(game.homeTeam)}
                    </>
                  )}
                </View>,
              ]
            : acc;
        }, [] as JSX.Element[])
        .slice(splitIdx, splitIdx + DEFAUL_COLUMNS_COUNT)}
    </View>
  );
};

export default RowTimeSlot;
