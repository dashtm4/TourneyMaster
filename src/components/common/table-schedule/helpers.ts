import { findIndex } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from '../matrix-table/helper';
import { IDivision, IEventSummary, IPool } from 'common/models';
import { IField } from 'common/models/schedule/fields';
import { IMultiSelectOption } from '../multi-select';

interface IApplyFilterParams {
  divisions: IDivision[];
  pools: IPool[];
  teamCards: ITeamCard[];
  eventSummary: IEventSummary[];
}

interface IFilterValues {
  divisionsOptions: IMultiSelectOption[];
  poolsOptions: IMultiSelectOption[];
  teamsOptions: IMultiSelectOption[];
  fieldsOptions: IMultiSelectOption[];
}

const getUnassignedTeams = (
  teamCards: ITeamCard[],
  minGamesNum: number | null
) =>
  teamCards.filter(
    teamCard => (teamCard.games?.length || 0) < (minGamesNum || 3)
  );

const mapCheckedValues = (values: IMultiSelectOption[]) =>
  values.filter(item => item.checked).map(item => item.value);

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

const mapTeamCardsToOptions = (values: ITeamCard[], checked = true) =>
  values.map(item => ({
    label: item.name,
    value: item.id,
    checked,
  }));

const mapEventSummaryToOptions = (values: IEventSummary[], checked = true) =>
  values.map(item => ({
    label: `${item.facilities_initials} - ${item.field_name}`,
    value: item.field_id,
    checked,
  }));

export const applyFilters = (params: IApplyFilterParams) => {
  const { divisions, pools, teamCards, eventSummary } = params;

  const divisionsOptions: IMultiSelectOption[] = mapDivisionsToOptions(
    divisions
  );
  const poolsOptions: IMultiSelectOption[] = mapPoolsToOptions(pools);
  const teamsOptions: IMultiSelectOption[] = mapTeamCardsToOptions(teamCards);
  const fieldsOptions: IMultiSelectOption[] = mapEventSummaryToOptions(
    eventSummary
  );

  return {
    divisionsOptions,
    poolsOptions,
    teamsOptions,
    fieldsOptions,
  };
};

export const mapGamesByFilter = (
  games: IGame[],
  filterValues: IFilterValues
) => {
  const {
    divisionsOptions,
    poolsOptions,
    teamsOptions,
    fieldsOptions,
  } = filterValues;

  const divisionIds = mapCheckedValues(divisionsOptions);
  const poolIds = mapCheckedValues(poolsOptions);
  const teamIds = mapCheckedValues(teamsOptions);
  const fieldIds = mapCheckedValues(fieldsOptions);

  const filteredGamesIds = games
    .filter(
      game =>
        checkDivisions(game, divisionIds) &&
        checkPools(game, poolIds) &&
        checkTeams(game, teamIds) &&
        checkFields(game, fieldIds)
    )
    .map(game => game.id);

  return games.map(game => {
    if (!filteredGamesIds.includes(game.id)) {
      delete game.awayTeam;
      delete game.homeTeam;
    }

    return game;
  });
};

const checkDivisions = (game: IGame, divisionIds: string[]) => {
  const { awayTeam, homeTeam } = game;
  return divisionIds.includes(awayTeam?.divisionId! || homeTeam?.divisionId!);
};

const checkPools = (game: IGame, poolIds: string[]) => {
  const { awayTeam, homeTeam } = game;
  return poolIds.includes(awayTeam?.poolId! || homeTeam?.poolId!);
};

const checkTeams = (game: IGame, teamIds: string[]) => {
  const { awayTeam, homeTeam } = game;
  return teamIds.includes(awayTeam?.id!) || teamIds.includes(homeTeam?.id!);
};

const checkFields = (game: IGame, fieldIds: string[]) => {
  return fieldIds.includes(game.fieldId);
};

export const mapFilterValues = (
  params: {
    teamCards: ITeamCard[];
    pools: IPool[];
  },
  filterValues: IFilterValues
) => {
  const { teamCards, pools } = params;
  const { divisionsOptions, poolsOptions, teamsOptions } = filterValues;
  const divisionIds = mapCheckedValues(divisionsOptions);

  const allPoolsOptions: IMultiSelectOption[] = mapPoolsToOptions(pools);
  const allTeamsOptions: IMultiSelectOption[] = mapTeamCardsToOptions(
    teamCards
  );

  const poolIds = mapCheckedValues(poolsOptions);

  const divisionPools = pools.filter(item =>
    divisionIds.includes(item.division_id)
  );

  const divisionPoolTeams = teamCards.filter(
    item =>
      poolIds.includes(item.poolId!) && divisionIds.includes(item.divisionId)
  );

  const filteredPoolsOptions = allPoolsOptions
    .filter(item => findIndex(divisionPools, { pool_id: item.value }) >= 0)
    .map(item => ({
      ...item,
      checked: !!poolsOptions.find(el => el.value === item.value)?.checked,
    }));

  const filteredTeamsOptions = allTeamsOptions
    .filter(item => findIndex(divisionPoolTeams, { id: item.value }) >= 0)
    .map(item => ({
      ...item,
      checked: !!teamsOptions.find(el => el.value === item.value)?.checked,
    }));

  return {
    ...filterValues,
    poolsOptions: filteredPoolsOptions,
    teamsOptions: filteredTeamsOptions,
  };
};

export const mapUnusedFields = (fields: IField[], games: IGame[]) => {
  const filledGames = games.filter(
    game => game.awayTeam?.id || game.homeTeam?.id
  );
  const usedFieldIds = fields
    .map(field => field.id)
    .filter(fieldId => findIndex(filledGames, { fieldId }) >= 0);

  return fields.map(field => ({
    ...field,
    isUnused: !usedFieldIds.includes(field.id),
  }));
};

const mapGamesByField = (games: IGame[], fields: IField[]) =>
  games.map(game => {
    const currentField = fields.find(field => field.id === game.fieldId);

    return { ...game, facilityId: currentField?.facilityId };
  });

export { getUnassignedTeams, mapGamesByField };
