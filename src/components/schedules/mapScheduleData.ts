import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { IGame } from 'components/common/matrix-table/helper';
import { Auth } from 'aws-amplify';
import api from 'api/api';
import { IMember } from 'common/models';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { getVarcharEight } from 'helpers';
import { ITeam } from 'common/models/schedule/teams';
import { ISchedulesGame } from 'common/models/schedule/game';
import { ISchedulingSchedule } from 'components/scheduling/types';
import { unionWith, isEqual } from 'lodash-es';

export const mapScheduleData = (
  scheduleData: IConfigurableSchedule
): ISchedule => {
  const data = { ...scheduleData };
  delete data?.num_fields;
  delete data?.periods_per_game;
  delete data?.first_game_start;
  delete data?.last_game_end;
  delete data?.isManualScheduling;
  return data;
};

export const mapSchedulingScheduleData = (
  scheduleData: ISchedulingSchedule
) => {
  const data = { ...scheduleData };
  delete data?.createdByName;
  delete data?.updatedByName;
  return data;
};

const getVersionId = (
  gameId: number,
  schedulesDetails?: ISchedulesDetails[]
) => {
  if (schedulesDetails) {
    return schedulesDetails.find(
      item => Number(item.game_id) === Number(gameId)
    )?.schedule_version_id;
  }
  return false;
};

const getMember = async () => {
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === userEmail
  );
  return member;
};

export const mapSchedulesTeamCards = async (
  scheduleData: ISchedule,
  games: IGame[],
  isDraft: boolean,
  schedulesDetails?: ISchedulesDetails[]
) => {
  const member = await getMember();
  const memberId = member.member_id;

  const scheduleId = scheduleData.schedule_id;
  const eventId = scheduleData.event_id;

  const scheduleDetails: ISchedulesDetails[] = games.map(game => ({
    schedule_version_id:
      getVersionId(game.id, schedulesDetails) || getVarcharEight(),
    schedule_version_desc: null,
    schedule_id: scheduleId,
    schedule_desc: null,
    event_id: eventId,
    division_id: game.homeTeam?.divisionId || null,
    pool_id: game.homeTeam?.poolId || null,
    game_id: game.id,
    game_date: game.gameDate || null,
    game_time: game.startTime || null,
    field_id: game.fieldId,
    away_team_id: game.awayTeam?.id || null,
    home_team_id: game.homeTeam?.id || null,
    game_locked_YN: null,
    away_team_locked: game.awayTeam?.games?.filter(g => g.id === game.id)[0]
      .isTeamLocked
      ? 1
      : 0,
    home_team_locked: game.homeTeam?.games?.filter(g => g.id === game.id)[0]
      .isTeamLocked
      ? 1
      : 0,
    is_draft_YN: isDraft ? 1 : 0,
    is_published_YN: isDraft ? 0 : 1,
    created_by: memberId,
    created_datetime: game.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  }));

  return scheduleDetails;
};

export const mapTeamCardsToSchedulesGames = async (
  scheduleData: ISchedule,
  games: IGame[]
) => {
  const member = await getMember();
  const memberId = member.member_id;

  const scheduleId = scheduleData.schedule_id;
  const eventId = scheduleData.event_id;

  const schedulesGames: ISchedulesGame[] = games.map(game => ({
    game_id: String(game.varcharId || getVarcharEight()),
    event_id: eventId,
    schedule_id: scheduleId,
    sport_id: 1,
    facilities_id: game.facilityId || '',
    field_id: game.fieldId,
    game_date: '',
    start_time: game.startTime || '',
    division_id: game.awayTeam?.divisionId || null,
    pool_id: game.awayTeam?.poolId || null,
    away_team_id: game.awayTeam?.id || null,
    home_team_id: game.homeTeam?.id || null,
    away_team_score:
      game.awayTeam?.games?.find(g => g.id === game.id)?.teamScore || null,
    home_team_score:
      game.homeTeam?.games?.find(g => g.id === game.id)?.teamScore || null,
    is_active_YN: 0,
    is_final_YN: null,
    finalized_by: null,
    finalized_datetime: null,
    is_bracket_YN: null,
    created_by: memberId,
    created_datetime: game.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  }));

  return schedulesGames;
};

export const mapTeamsFromSchedulesDetails = (
  schedulesDetails: ISchedulesDetails[],
  teams: ITeam[]
) => {
  const sd = schedulesDetails.map(item => ({
    gameId: item.game_id,
    awayTeamId: item.away_team_id,
    homeTeamId: item.home_team_id,
    date: item.game_date || undefined,
  }));

  console.log(schedulesDetails.map(it => it.game_id));

  const runGamesSelection = (team: ITeam) => {
    const games = [
      ...sd
        .filter(
          ({ awayTeamId, homeTeamId }) =>
            awayTeamId === team.id || homeTeamId === team.id
        )
        .map(({ gameId, awayTeamId, date }) => ({
          id: Number(gameId),
          teamPosition: awayTeamId === team.id ? 1 : 2,
          date,
        })),
    ];

    return unionWith(games, isEqual);
  };

  const teamCards = teams.map(team => ({
    ...team,
    games: runGamesSelection(team),
  }));

  return teamCards;
};

export const mapTeamsFromShedulesGames = (
  schedulesGames: ISchedulesGame[],
  teams: ITeam[],
  games: IGame[]
) => {
  const sd = schedulesGames.map(item => {
    const currentGame = games.find(game => game.varcharId === item.game_id);

    const mappedSchedulesGame = {
      gameId: currentGame!.id,
      awayTeamId: item.away_team_id,
      awayTeamScore: item.away_team_score,
      homeTeamId: item.home_team_id,
      homeTeamScore: item.home_team_score,
    };

    return mappedSchedulesGame;
  });

  const teamCards = teams.map(team => ({
    ...team,
    games: [
      ...sd
        .filter(
          ({ awayTeamId, homeTeamId }) =>
            awayTeamId === team.id || homeTeamId === team.id
        )
        .map(({ gameId, awayTeamId, awayTeamScore, homeTeamScore }) => ({
          id: Number(gameId),
          teamPosition: awayTeamId === team.id ? 1 : 2,
          teamScore: awayTeamId === team.id ? awayTeamScore : homeTeamScore,
        })),
    ],
  }));

  return teamCards;
};
