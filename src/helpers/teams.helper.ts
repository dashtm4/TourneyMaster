import {
  ITeam,
  ISchedulesGame,
  ITeamWithResults,
  ISchedulesGameWithNames,
} from 'common/models';
import { RankingFactorValues } from 'common/enums';

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

const countTie = (
  prevValue: undefined | number,
  teamOneScore: null | string | number,
  teamTwoScore: null | string | number
) => {
  let tie = prevValue === undefined ? 0 : prevValue;

  if (
    Number(teamOneScore) > 0 &&
    Number(teamTwoScore) > 0 &&
    teamOneScore === teamTwoScore
  ) {
    tie = tie + 1;
  }

  return tie;
};

const countGoalDifferential = (
  prevValue: undefined | number,
  teamOneScore: null | string | number,
  teamTwoScore: null | string | number
) => {
  let scoreValue = prevValue === undefined ? 0 : prevValue;

  const incrementCount = Number(teamOneScore) - Number(teamTwoScore);

  scoreValue = scoreValue + incrementCount;

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
        tie: countTie(awayTeam.tie, game.home_team_score, game.away_team_score),
        goalsScored: countTeamScore(awayTeam.goalsScored, game.away_team_score),
        goalsAllowed: countTeamScore(
          awayTeam.goalsAllowed,
          game.home_team_score
        ),
        goalsDifferential: countGoalDifferential(
          awayTeam.goalsDifferential,
          game.away_team_score,
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
        tie: countTie(homeTeam.tie, game.home_team_score, game.away_team_score),
        goalsScored: countTeamScore(homeTeam.goalsScored, game.home_team_score),
        goalsAllowed: countTeamScore(
          homeTeam.goalsAllowed,
          game.away_team_score
        ),
        goalsDifferential: countGoalDifferential(
          homeTeam.goalsDifferential,
          game.home_team_score,
          game.away_team_score
        ),
      };
    }
  });

  return localTeams;
};

const sortTeamsByBestRecord = (
  a: ITeamWithResults,
  b: ITeamWithResults,
  _: unknown
) => {
  const sortedTeams = b.wins - a.wins;

  return sortedTeams;
};

const sortTeamsByHeadToHead = (
  a: ITeamWithResults,
  b: ITeamWithResults,
  games: ISchedulesGameWithNames[]
) => {
  const teamScores = games.reduce(
    (acc, game) => {
      if (
        (game.homeTeamId === a.team_id && game.awayTeamId === b.team_id) ||
        (game.homeTeamId === b.team_id && game.awayTeamId === a.team_id)
      ) {
        const gameTeamAScore =
          a.team_id === game.homeTeamId
            ? game.homeTeamScore
            : game.awayTeamScore;

        const gameTeamBScore =
          b.team_id === game.homeTeamId
            ? game.homeTeamScore
            : game.awayTeamScore;

        return {
          teamAScore: acc.teamAScore = acc.teamAScore + Number(gameTeamAScore),
          teamBScore: acc.teamBScore = acc.teamBScore + Number(gameTeamBScore),
        };
      }

      return acc;
    },
    { teamAScore: 0, teamBScore: 0 }
  );

  const sortedTeams = teamScores.teamBScore - teamScores.teamAScore;

  return sortedTeams;
};

const sortTeamsByGoalScored = (
  a: ITeamWithResults,
  b: ITeamWithResults,
  _: unknown
) => {
  const sortedTeams = b.goalsScored - a.goalsScored;

  return sortedTeams;
};

const sortTeamsByDifference = (
  a: ITeamWithResults,
  b: ITeamWithResults,
  _: unknown
) => {
  const sortedTeams =
    b.goalsScored - b.goalsAllowed - (a.goalsScored - a.goalsAllowed);

  return sortedTeams;
};

const sortTeamsByGoalAllowed = (
  a: ITeamWithResults,
  b: ITeamWithResults,
  _: unknown
) => {
  const sortedTeams = a.goalsAllowed - b.goalsAllowed;

  return sortedTeams;
};

const SortTeamsBy = {
  [RankingFactorValues.WIN_PERCENTAGE]: sortTeamsByBestRecord,
  [RankingFactorValues.HEAD_TO_HEAD]: sortTeamsByHeadToHead,
  [RankingFactorValues.GOAL_ALLOWED]: sortTeamsByGoalAllowed,
  [RankingFactorValues.GOAL_DIFFERENCE]: sortTeamsByDifference,
  [RankingFactorValues.GOAL_SCORED]: sortTeamsByGoalScored,
};

const sortTeamByScored = (
  teams: ITeamWithResults[],
  games: ISchedulesGameWithNames[],
  rankings: string
) => {
  const parsedRankings = JSON.parse(rankings);

  if (parsedRankings.length !== Object.keys(RankingFactorValues).length / 2) {
    return teams;
  }

  const localTeams = [...teams];

  return localTeams.sort(
    (a, b) =>
      SortTeamsBy[parsedRankings[0]](a, b, games) ||
      SortTeamsBy[parsedRankings[1]](a, b, games) ||
      SortTeamsBy[parsedRankings[2]](a, b, games) ||
      SortTeamsBy[parsedRankings[3]](a, b, games) ||
      SortTeamsBy[parsedRankings[4]](a, b, games)
  );
};

export { getTeamsWithResults, sortTeamByScored };
