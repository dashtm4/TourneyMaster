import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { IGame } from 'components/common/matrix-table/helper';
import { Auth } from 'aws-amplify';
import api from 'api/api';
import { IMember } from 'common/models';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { getVarcharEight } from 'helpers';
import { ITeam } from 'common/models/schedule/teams';

export const mapScheduleData = (
  scheduleData: IConfigurableSchedule
): ISchedule => {
  const data = { ...scheduleData };
  delete data?.num_fields;
  delete data?.periods_per_game;
  delete data?.first_game_start;
  delete data?.last_game_end;
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

export const mapSchedulesTeamCards = async (
  scheduleData: ISchedule,
  games: IGame[],
  isDraft: boolean,
  schedulesDetails?: ISchedulesDetails[]
) => {
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === userEmail
  );

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
    game_date: null,
    game_time: game.startTime || null,
    field_id: game.fieldId,
    away_team_id: game.awayTeam?.id || null,
    home_team_id: game.homeTeam?.id || null,
    game_locked_YN: null,
    away_team_locked: null,
    home_team_locked: null,
    is_draft_YN: isDraft ? 1 : 0,
    is_published_YN: isDraft ? 0 : 1,
    created_by: memberId,
    created_datetime: game.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  }));

  return scheduleDetails;
};

export const mapTeamsFromSchedulesDetails = (
  schedulesDetails: ISchedulesDetails[],
  teams: ITeam[]
) => {
  const sd = schedulesDetails.map(item => ({
    gameId: item.game_id,
    awayTeamId: item.away_team_id,
    homeTeamId: item.home_team_id,
  }));

  const teamCards = teams.map(team => ({
    ...team,
    games: [
      ...sd
        .filter(
          ({ awayTeamId, homeTeamId }) =>
            awayTeamId === team.id || homeTeamId === team.id
        )
        .map(({ gameId, awayTeamId }) => ({
          id: Number(gameId),
          teamPosition: awayTeamId === team.id ? 1 : 2,
        })),
    ],
  }));

  return teamCards;
};
