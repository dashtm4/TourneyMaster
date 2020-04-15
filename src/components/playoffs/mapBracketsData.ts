import { Auth } from 'aws-amplify';
import api from 'api/api';
import { IBracket } from 'common/models/playoffs/bracket';
import { getVarcharEight } from 'helpers';
import { IMember } from 'common/models';
import { IBracketGame } from './bracketGames';

const YN = (v: boolean) => (!!v ? 1 : 0);

const getMember = async () => {
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === userEmail
  );
  return member;
};

export const mapBracketData = async (bracket: IBracket, isDraft: boolean) => {
  const member = await getMember();
  const memberId = member.member_id;

  return {
    bracket_id: bracket.id,
    schedule_id: bracket.scheduleId,
    bracket_name: bracket.name,
    bracket_date: bracket.bracketDate,
    bracket_status: isDraft ? 'Draft' : 'Published',
    align_games: YN(bracket.alignItems),
    adjust_columns: YN(bracket.adjustTime),
    start_timeslot: null,
    custom_warmup: bracket.warmup,
    end_timeslot: null,
    fields_excluded: null,
    is_active_YN: 1,
    created_by: memberId,
    created_datetime: bracket.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  };
};

export const mapBracketGames = async (
  bracketGames: IBracketGame[],
  bracket: IBracket
) => {
  const member = await getMember();
  const memberId = member.member_id;

  return bracketGames.map(game => ({
    game_id: getVarcharEight(),
    bracket_id: bracket.id,
    event_id: bracket.eventId,
    division_id: game.divisionId,
    bracket_year: game.divisionName,
    round_id: game.round,
    field_id: game.fieldId,
    game_date: game.gameDate,
    game_num: game.index,
    start_time: game.startTime,
    results_order: null,
    seed_num_away: game.awaySeedId,
    seed_num_home: game.homeSeedId,
    away_team_id: game.awayTeamId || null,
    home_team_id: game.homeTeamId || null,
    away_team_score: null,
    home_team_score: null,
    is_active_YN: 1,
    created_by: memberId,
    created_datetime: game.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  }));
};
