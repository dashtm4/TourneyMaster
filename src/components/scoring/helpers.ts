import { ISchedulesGame, ITeam } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';

const mapGamesWithSchedulesGamesId = (
  games: IGame[],
  schedulesGames: ISchedulesGame[]
) => {
  const mappedGames = games?.map(game => ({
    ...game,
    varcharId: schedulesGames.find(
      schedulesGame =>
        game.fieldId === schedulesGame.field_id &&
        game.startTime === schedulesGame.start_time
    )?.game_id,
  }));

  return mappedGames;
};

interface ITeamWithResults extends ITeam {
  wins: number;
  losses: number;
  goalsScored: number;
  goalsAllowed: number;
}

const countMatchScore = (
  prevValue: undefined | number,
  teamOneScore: null | string | number,
  teamTwoScore: null | string | number
) => {
  let score = prevValue === undefined ? 0 : prevValue;
  const scoreOne = Number(teamOneScore);
  const scoreTwo = Number(teamTwoScore);

  if (scoreOne > scoreTwo) {
    score = score + 1;
  }

  return score;
};

const countTeamScore = (
  prevValue: undefined | number,
  teamScore: null | string | number
) => {
  let scoreValue = prevValue === undefined ? 0 : prevValue;

  const score = Number(teamScore);

  scoreValue = scoreValue + score;

  return scoreValue;
};

const getTeamsWithResults = (
  teams: ITeam[],
  games: ISchedulesGame[]
): ITeamWithResults[] => {
  const localTeams = [...teams] as ITeamWithResults[];

  games.forEach(game => {
    const awayTeamIdx = localTeams.findIndex(
      team => team.team_id === game.away_team_id
    );

    const homeTeamIdx = localTeams.findIndex(
      team => team.team_id === game.home_team_id
    );

    if (awayTeamIdx >= 0) {
      const awayTeam = localTeams[awayTeamIdx];

      localTeams[awayTeamIdx] = {
        ...awayTeam,
        wins: countMatchScore(
          awayTeam.wins,
          game.away_team_score,
          game.home_team_score
        ),
        losses: countMatchScore(
          awayTeam.losses,
          game.home_team_score,
          game.away_team_score
        ),
        goalsScored: countTeamScore(awayTeam.goalsScored, game.away_team_score),
        goalsAllowed: countTeamScore(
          awayTeam.goalsAllowed,
          game.home_team_score
        ),
      };
    }

    if (homeTeamIdx >= 0) {
      const homeTeam = localTeams[homeTeamIdx];

      localTeams[homeTeamIdx] = {
        ...homeTeam,
        wins: countMatchScore(
          homeTeam.wins,
          game.home_team_score,
          game.away_team_score
        ),
        losses: countMatchScore(
          homeTeam.losses,
          game.away_team_score,
          game.home_team_score
        ),
        goalsScored: countTeamScore(homeTeam.goalsScored, game.home_team_score),
        goalsAllowed: countTeamScore(
          homeTeam.goalsAllowed,
          game.away_team_score
        ),
      };
    }
  });

  // console.log(localTeams.filter(it => it.goalsScored));

  console.log(localTeams.filter(it => it.losses || it.wins));

  // console.log(
  //   games.filter(it => it.away_team_score === 4 || it.away_team_score === 4)
  // );

  // console.log(localTeams);

  // console.log(games.filter(it => it.away_team_score || it.home_team_score));

  // console.log(games.filter(it => it.away_team_score || it.home_team_score));

  return localTeams;
};

export { mapGamesWithSchedulesGamesId, getTeamsWithResults };
