import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot, getDivisionCutName } from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { DEFAUL_COLUMNS_COUNT } from '../../common';
import { styles } from './styles';

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
    color: isHeatMap ? '#ffffff' : '#000000',
  });

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
                      <View
                        style={{
                          ...styles.gameTeamName,
                          ...getTeamColorStyles(game.awayTeam),
                        }}
                      >
                        <Text style={styles.teamNameWrapper}>
                          {game.awayTeam?.name}
                        </Text>
                        <Text style={styles.divisionNameWrapper}>
                          {` (${getDivisionCutName(
                            game.awayTeam.divisionShortName!
                          )})`}
                        </Text>
                      </View>
                      <View
                        style={{
                          ...styles.gameTeamName,
                          ...getTeamColorStyles(game.homeTeam),
                        }}
                      >
                        <Text style={styles.teamNameWrapper}>
                          {game.homeTeam?.name}
                        </Text>
                        <Text style={styles.divisionNameWrapper}>
                          {` (${getDivisionCutName(
                            game.homeTeam.divisionShortName!
                          )})`}
                        </Text>
                      </View>
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
