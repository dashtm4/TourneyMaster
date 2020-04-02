import {
  ISchedulesGame,
  IFacility,
  IField,
  ITeam,
  ISchedulesGameWithNames,
} from 'common/models';
import Api from 'api/api';

const findTeam = (teamId: string, teams: ITeam[]) => {
  const currentTeam = teams.find(team => team.team_id === teamId);

  return currentTeam;
};

const mapScheduleGamesWithNames = async (
  eventId: string,
  games: ISchedulesGame[]
) => {
  const teams = await Api.get(`/teams?event_id=${eventId}`);
  const facilities = await Api.get(`/facilities?event_id=${eventId}`);
  const fields = (
    await Promise.all(
      facilities.map((it: IFacility) =>
        Api.get(`/fields?facilities_id=${it.facilities_id}`)
      )
    )
  ).flat();

  const mappedGames = games.map(
    (game): ISchedulesGameWithNames => {
      const currentField = fields.find(
        (field: IField) => field.field_id === game.field_id
      );

      return {
        id: game.game_id,
        fieldId: game.field_id,
        fieldName: currentField.field_name,
        awayTeamId: game.away_team_id!,
        awayTeamName: findTeam(game.away_team_id!, teams)?.short_name!,
        awayTeamScore: game.away_team_score || '0',
        homeTeamId: game.home_team_id!,
        homeTeamName: findTeam(game.home_team_id!, teams)?.short_name!,
        homeTeamScore: game.home_team_score || '0',
        gameDate: game.game_date,
        startTime: game.start_time!,
      };
    }
  );

  return mappedGames;
};

export { mapScheduleGamesWithNames };
