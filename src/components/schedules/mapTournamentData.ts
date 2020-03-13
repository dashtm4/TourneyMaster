import { IFetchedTeam, ITeam } from 'common/models/schedule/teams';
import { IFetchedDivision } from 'common/models/schedule/divisions';
import { IField as IFetchedField } from 'common/models/field';
import { IField } from 'common/models/schedule/fields';
import { IFacility as IFetchedFacility } from 'common/models';

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

export const mapFieldsData = (fields: IFetchedField[]) => {
  let mappedFields: IField[];

  mappedFields = fields.map(field => ({
    id: field.field_id,
    facilityId: field.facilities_id,
    name: field.field_name,
    isPremier: Boolean(field.is_premier_YN),
  }));

  return mappedFields;
};

export const mapFacilitiesData = (facilities: IFetchedFacility[]) => {
  const mappedFacilities = facilities.map(facility => ({
    id: facility.facilities_id,
    name: facility.facilities_description,
    fields: facility.num_fields,
  }));

  return mappedFacilities;
};

export const mapDivisionsData = (divisions: IFetchedDivision[]) => {
  const mappedDivisions = divisions.map(division => ({
    id: division.division_id,
    name: division.short_name,
    isPremier: Boolean(division.is_premier_YN),
  }));

  return mappedDivisions;
};
