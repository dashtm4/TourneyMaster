import { ITeam, ISchedulesGame, ITeamWithResults } from 'common/models';

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

  return localTeams;
};

export { getTeamsWithResults };
