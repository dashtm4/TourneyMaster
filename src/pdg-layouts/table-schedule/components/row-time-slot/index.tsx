import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot, getDivisionCutName } from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { DEFAUL_COLUMNS_COUNT } from '../../common';
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
  <View
    style={{ ...styles.timeSlotRow, backgroundColor: isEven ? EVEN_COLOR : '' }}
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
                <View style={styles.gameTeamName}>
                  {game.awayTeam?.name && (
                    <>
                      <View style={styles.teamNameWrapper}>
                        {game.awayTeam?.name}
                      </View>
                      <Text>
                        {`(${getDivisionCutName(
                          game.awayTeam.divisionShortName!
                        )})`}
                      </Text>
                    </>
                  )}
                </View>
                <Text style={styles.gameTeamName}>
                  {game.homeTeam?.name &&
                    `${game.homeTeam?.name} (${getDivisionCutName(
                      game.homeTeam.divisionShortName!
                    )})`}
                </Text>
              </View>,
            ]
          : acc;
      }, [] as JSX.Element[])
      .slice(splitIdx, splitIdx + DEFAUL_COLUMNS_COUNT)}
  </View>
);

export default RowTimeSlot;
