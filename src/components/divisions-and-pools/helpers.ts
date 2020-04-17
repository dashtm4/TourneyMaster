import { ITeam } from 'common/models';

const mapTeamWithUnassignedTeams = (
  team: ITeam[],
  unassignedTeams: ITeam[]
) => {
  const mappedTeams = team.map(team => {
    const currentTeam = unassignedTeams.find(
      unassignedTeam => unassignedTeam.team_id === team.team_id
    );

    return currentTeam || team;
  });

  return mappedTeams;
};

export { mapTeamWithUnassignedTeams };
