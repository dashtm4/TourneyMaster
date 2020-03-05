import { IFetchedTeam, ITeam } from 'common/models/schedule/teams';

export const mapTeamsData = (teams: IFetchedTeam[]) => {
  let mappedTeams: ITeam[];

  mappedTeams = teams.map(team => ({
    id: team.team_id,
    name: team.short_name,
    startTime: '08:00:00',
    poolId: team.pool_id,
    divisionId: team.division_id,
    isPremier: false,
  }));

  return mappedTeams;
};
