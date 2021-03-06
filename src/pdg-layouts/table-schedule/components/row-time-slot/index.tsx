import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot } from 'helpers';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { getContrastingColor } from 'components/common/matrix-table/helper';
import { styles } from './styles';
import { getDisplayName } from 'components/common/matrix-table/dnd/seed';

const EVEN_COLOR = '#DCDCDC';

interface Props {
  timeSlot: ITimeSlot;
  games: IGame[];
  teamCards: ITeamCard[];
  isEven: boolean;
  isHeatMap?: boolean;
}

const RowTimeSlot = ({
  timeSlot,
  games,
  teamCards,
  isEven,
  isHeatMap,
}: Props) => {
  const getTeamColorStyles = (divisionHex?: string) => ({
    backgroundColor: isHeatMap ? (divisionHex ? divisionHex : '') : '',
    color: isHeatMap
      ? divisionHex
        ? getContrastingColor(divisionHex)
        : ''
      : '#000000',
  });

  const getTeam = (team: ITeamCard) => (
    <View
      style={{
        ...styles.gameTeamName,
        ...getTeamColorStyles(team.divisionHex),
      }}
    >
      <Text style={styles.teamNameWrapper}>{team.name}</Text>
      <Text style={styles.divisionNameWrapper}>
        {` (${team.divisionShortName!})`}
      </Text>
    </View>
  );

  const getBracketTeam = (
    teamName?: string,
    divisionName?: string,
    round?: number,
    dependsUpon?: number,
    seedId?: number
  ) => {
    return (
      <View
        style={{
          ...styles.gameTeamName,
          backgroundColor: '#000000',
          color: '#ffffff',
        }}
      >
        {teamName ? (
          <>
            <Text style={styles.teamNameWrapper}>{teamName}</Text>
            {divisionName && (
              <Text style={styles.divisionNameWrapper}>
                {`(${divisionName})`}
              </Text>
            )}
          </>
        ) : seedId ? (
          <>
            <Text style={styles.teamNameWrapper}>{`Seed ${seedId}`}</Text>
            {divisionName && (
              <Text style={styles.divisionNameWrapper}>
                {`(${divisionName})`}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.teamNameWrapper}>
            {getDisplayName(round, dependsUpon)}
          </Text>
        )}
      </View>
    );
  };

  const getBracketGame = (game: IGame) => {
    const {
      awaySeedId,
      homeSeedId,
      playoffRound,
      divisionName,
      awayDependsUpon,
      homeDependsUpon,
    } = game;

    const awayTeamName = teamCards.find(item => item.id === game.awayTeamId)
      ?.name;
    const homeTeamName = teamCards.find(item => item.id === game.homeTeamId)
      ?.name;

    return (
      <View style={styles.gameWrapper} key={game.id}>
        <>
          {getBracketTeam(
            awayTeamName,
            divisionName,
            playoffRound,
            awayDependsUpon,
            awaySeedId
          )}
        </>
        <>
          {getBracketTeam(
            homeTeamName,
            divisionName,
            playoffRound,
            homeDependsUpon,
            homeSeedId
          )}
        </>
      </View>
    );
  };

  return (
    <View
      style={{
        ...styles.timeSlotRow,
        backgroundColor: !isHeatMap && isEven ? EVEN_COLOR : '',
      }}
      wrap={false}
    >
      <Text style={styles.timeSlot}>{formatTimeSlot(timeSlot.time)}</Text>
      {games.map(game => {
        const isBracketGame =
          !game.awayTeam &&
          (game.awaySeedId || game.awayDependsUpon) &&
          game.bracketGameId;

        if (isBracketGame) {
          return getBracketGame(game);
        }
        return (
          <View style={styles.gameWrapper} key={game.id}>
            {game.awayTeam && game.homeTeam && (
              <>
                {getTeam(game.awayTeam)}
                {getTeam(game.homeTeam)}
              </>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default RowTimeSlot;
