import { IField, IPool, IDivision, ITeam } from 'common/models';
import { IMultiSelectOption } from 'components/common/multi-select';
import { findIndex, find } from 'lodash-es';

const mapDivisionsToOptions = (values: IDivision[], checked = true) =>
  values.map(item => ({
    label: item.short_name,
    value: item.division_id,
    checked,
  }));

const mapPoolsToOptions = (values: IPool[], checked = true) =>
  values.map(item => ({
    label: item.pool_name,
    value: item.pool_id,
    checked,
  }));

const mapTeamsToOptions = (values: ITeam[], checked = true) =>
  values.map(item => ({
    label: item.long_name!,
    value: item.team_id!,
    checked,
  }));

const mapFieldsTopOptions = (values: IField[], checked = true) =>
  values.map(item => ({
    label: item.field_name,
    value: item.field_id,
    checked,
  }));

export const applyFilters = (params: any, event?: string) => {
  const { divisions, pools, teams, fields } = params;

  const filteredDivisions = divisions.filter(
    (division: IDivision) => division.event_id === event
  );
  const filteredDivisionsIds = filteredDivisions.map(
    (division: IDivision) => division.division_id
  );
  const filteredPools = pools.filter((pool: IPool) =>
    filteredDivisionsIds.includes(pool.division_id)
  );
  const filteredTeams = teams.filter((team: ITeam) => team.event_id === event);
  const filteredFields = fields;

  const divisionsOptions: IMultiSelectOption[] = mapDivisionsToOptions(
    filteredDivisions
  );
  const poolsOptions: IMultiSelectOption[] = mapPoolsToOptions(filteredPools);
  const teamsOptions: IMultiSelectOption[] = mapTeamsToOptions(filteredTeams);
  const fieldsOptions: IMultiSelectOption[] = mapFieldsTopOptions(
    filteredFields
  );

  return {
    divisionsOptions,
    poolsOptions,
    teamsOptions,
    fieldsOptions,
  };
};

const mapCheckedValues = (values: IMultiSelectOption[]) =>
  values.filter(item => item.checked).map(item => item.value);

const filterPoolsByDivisionIds = (pools: IPool[], divisionIds: string[]) =>
  pools.filter(pool => divisionIds.includes(pool.division_id));

const filterPoolsOptionsByPools = (
  poolOptions: IMultiSelectOption[],
  options: IMultiSelectOption[],
  pools: IPool[]
) =>
  poolOptions
    .filter(item => findIndex(pools, { pool_id: item.value }) >= 0)
    .map(item => ({
      ...item,
      checked: find(options, { value: item.value })
        ? !!find(options, { value: item.value })?.checked
        : true,
    }));

const filterTeamsByDivisionsAndPools = (
  teams: ITeam[],
  divisionIds: string[],
  poolIds: string[]
) =>
  teams.filter(
    item =>
      divisionIds.includes(item.division_id) && poolIds.includes(item.pool_id!)
  );

const filterTeamsOptionsByTeams = (
  teamsOptions: IMultiSelectOption[],
  options: IMultiSelectOption[],
  teams: ITeam[]
) =>
  teamsOptions
    .filter(item => findIndex(teams, { team_id: item.value }) >= 0)
    .map(item => ({
      ...item,
      checked: find(options, { value: item.value })
        ? !!find(options, { value: item.value })?.checked
        : true,
    }));

export const mapFilterValues = (
  params: {
    teams: ITeam[];
    pools: IPool[];
  },
  filterValues: any
) => {
  const { teams, pools } = params;
  const { divisionsOptions, teamsOptions, poolsOptions } = filterValues;
  const divisionIds = mapCheckedValues(divisionsOptions);

  const allPoolsOptions: IMultiSelectOption[] = mapPoolsToOptions(pools);
  const allTeamsOptions: IMultiSelectOption[] = mapTeamsToOptions(teams);

  // Pools rely on:
  // Checked divisions
  // - Get all pools and filter them by checked division ids
  // - Get all pools options and filter them by filtered pools and checked pools options
  const filteredPools = filterPoolsByDivisionIds(pools, divisionIds);
  const filteredPoolsOptions = filterPoolsOptionsByPools(
    allPoolsOptions,
    poolsOptions,
    filteredPools
  );

  // Teams realy on:
  // Checked divisions
  // Checked pools
  // - Get all teams and filter them by checked division ids and checked pool ids
  // - Get all teams options and filter them by filtered teams and checked teams options
  const poolIds = mapCheckedValues(filteredPoolsOptions);
  const filteredTeams = filterTeamsByDivisionsAndPools(
    teams,
    divisionIds,
    poolIds
  );
  const filteredTeamsOptions = filterTeamsOptionsByTeams(
    allTeamsOptions,
    teamsOptions,
    filteredTeams
  );

  return {
    ...filterValues,
    poolsOptions: filteredPoolsOptions,
    teamsOptions: filteredTeamsOptions,
  };
};
