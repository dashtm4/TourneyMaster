import {
  ISchedulesGame,
  IField,
  ITeam,
  ISchedulesGameWithNames,
} from 'common/models';

const findTeam = (teamId: string, teams: ITeam[]): ITeam => {
  const currentTeam = teams.find(team => team.team_id === teamId);

  return currentTeam!;
};

const mapScheduleGamesWithNames = (
  teams: ITeam[],
  fields: IField[],
  games: ISchedulesGame[]
) => {
  const mappedGames = games.reduce((acc, game) => {
    if (game.away_team_id === null || game.home_team_id === null) {
      return acc;
    }

    const currentField = fields.find(
      (field: IField) => field.field_id === game.field_id
    );
    const awayTeam = findTeam(game.away_team_id, teams);
    const homeTeam = findTeam(game.home_team_id, teams);

    const scheduleGamesWithNames = {
      id: game.game_id,
      fieldId: game.field_id,
      divisionId: awayTeam.division_id,
      fieldName: currentField?.field_name || 'Field',
      awayTeamId: game.away_team_id,
      awayTeamName: awayTeam.short_name,
      awayTeamScore: game.away_team_score,
      homeTeamId: game.home_team_id,
      homeTeamName: homeTeam.short_name,
      homeTeamScore: game.home_team_score,
      gameDate: game.game_date,
      startTime: game.start_time!,
      createTime: game.created_datetime,
      updatedTime: game.updated_datetime,
    };

    return [...acc, scheduleGamesWithNames];
  }, [] as ISchedulesGameWithNames[]);

  return mappedGames;
};

export { mapScheduleGamesWithNames };
