import { IFetchedTeam, ITeam } from 'common/models/schedule/teams';
import { IFetchedDivision } from 'common/models/schedule/divisions';

const teamPremierByDivision = (
  team: IFetchedTeam,
  divisions: IFetchedDivision[]
) => {
  const division = divisions.find(
    element => element.division_id === team.division_id
  );
  if (!division) return false;
  return Boolean(division.is_premier_YN);
};

export const mapTeamsData = (
  teams: IFetchedTeam[],
  divisions: IFetchedDivision[]
) => {
  let mappedTeams: ITeam[];

  mappedTeams = teams.map(team => ({
    id: team.team_id,
    name: team.short_name,
    startTime: '08:00:00',
    poolId: team.pool_id,
    divisionId: team.division_id,
    isPremier: teamPremierByDivision(team, divisions),
  }));

  return mappedTeams;
};
