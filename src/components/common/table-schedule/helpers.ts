import { orderBy, findIndex, xor } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from '../matrix-table/helper';
import { IScheduleFilter, DayTypes, DefaultSelectValues } from './types';
import { MultipleSelectionField } from '../multiple-search-select';
import { IDivision, IEventSummary, IPool } from 'common/models';
import { SortByFilesTypes } from 'common/enums';
import { IField } from 'common/models/schedule/fields';

const getUnassignedTeams = (
  teamCards: ITeamCard[],
  minGamesNum: number | null
) =>
  teamCards.filter(
    teamCard => (teamCard.games?.length || 0) < (minGamesNum || 3)
  );

const mapValues = (values: MultipleSelectionField[]) =>
  values.map(el => el.value);

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

export const mapGamesByFilter = (games: IGame[], filter: IScheduleFilter) => {
  const {
    selectedDivisions,
    selectedPools,
    selectedTeams,
    selectedFields,
  } = filter;

  const divisionIds = mapValues(selectedDivisions);
  const poolIds = mapValues(selectedPools);
  const teamIds = mapValues(selectedTeams);
  const fieldIds = mapValues(selectedFields);

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

export const mapFilterValues = (
  teamCards: ITeamCard[],
  filter: IScheduleFilter
) => {
  const { selectedDivisions } = filter;

  const divisionIds = mapValues(selectedDivisions);

  const filteredTeams = teamCards
    .filter(teamCard => divisionIds.includes(teamCard.divisionId!))
    .map(teamCard => ({
      ...teamCard,
      name: `${teamCard.name} (${teamCard.divisionShortName})`,
    }));

  return { filteredTeams };
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

export const selectDivisionsFilter = (divisions: IDivision[]) => [
  { label: 'All', value: DefaultSelectValues.ALL },
  ...orderBy(divisions, SortByFilesTypes.DIVISIONS).map(division => ({
    label: division[SortByFilesTypes.DIVISIONS],
    value: division.division_id,
  })),
];

export const selectPoolsFilter = (pools: IPool[]) => [
  { label: 'All', value: DefaultSelectValues.ALL },
  ...orderBy(pools, 'name').map(pool => ({
    label: pool.pool_id,
    value: pool.pool_id,
  })),
];

export const selectTeamsFilter = (teamCards: ITeamCard[]) => [
  { label: 'All', value: DefaultSelectValues.ALL },
  ...orderBy(teamCards, 'divisionShortName').map(team => ({
    label: team.name,
    value: team.id,
  })),
];

export const selectFieldsFilter = (eventSummary: IEventSummary[]) => [
  { label: 'All', value: DefaultSelectValues.ALL },
  ...orderBy(eventSummary, SortByFilesTypes.FACILITIES_INITIALS).map(es => ({
    label: `${es[SortByFilesTypes.FACILITIES_INITIALS]} - ${es.field_name}`,
    value: es.field_id,
  })),
];

export const applyFilters = (
  divisions: IDivision[],
  pools: IPool[],
  teamCards: ITeamCard[],
  eventSummary: IEventSummary[]
) => {
  const selectedDivisions = selectDivisionsFilter(divisions);

  const selectedPools = selectPoolsFilter(pools);

  const selectedTeams = selectTeamsFilter(teamCards);

  const selectedFields = selectFieldsFilter(eventSummary);

  return {
    selectedDay: DayTypes.DAY_ONE,
    selectedDivisions,
    selectedPools,
    selectedTeams,
    selectedFields,
  };
};

export const handleFilterData = (
  filter: IScheduleFilter,
  newFilter: IScheduleFilter,
  divisions: IDivision[],
  pools: IPool[],
  teamCards: ITeamCard[],
  eventSummary: IEventSummary[]
) => {
  const divisionIds = mapValues(filter.selectedDivisions);
  const poolIds = mapValues(filter.selectedPools);
  const teamIds = mapValues(filter.selectedTeams);
  const fieldIds = mapValues(filter.selectedFields);

  const newDivisionIds = mapValues(newFilter.selectedDivisions);
  const newPoolIds = mapValues(newFilter.selectedPools);
  const newTeamIds = mapValues(newFilter.selectedTeams);
  const newFieldIds = mapValues(newFilter.selectedFields);

  const updateFilterData: IScheduleFilter = newFilter;

  const all = DefaultSelectValues.ALL;

  /* DIVISION ALL CHECKING */
  const divisionsXor = xor(divisionIds, newDivisionIds);
  if (divisionsXor?.length === 1 && divisionsXor[0] === all) {
    return {
      ...updateFilterData,
      selectedDivisions: newDivisionIds.includes(all)
        ? selectDivisionsFilter(divisions)
        : [],
    };
  }

  /* POOLS ALL CHECKING */
  const poolsXor = xor(poolIds, newPoolIds);
  if (poolsXor?.length === 1 && poolsXor[0] === all) {
    return {
      ...updateFilterData,
      selectedPools: newPoolIds.includes(all) ? selectPoolsFilter(pools) : [],
    };
  }

  /* TEAMS ALL CHECKING */
  const teamsXor = xor(teamIds, newTeamIds);
  if (teamsXor?.length === 1 && teamsXor[0] === all) {
    return {
      ...updateFilterData,
      selectedTeams: newTeamIds.includes(all)
        ? selectTeamsFilter(teamCards)
        : [],
    };
  }

  /* FIELDS ALL CHECKING */
  const fieldsXor = xor(fieldIds, newFieldIds);
  if (fieldsXor?.length === 1 && fieldsXor[0] === all) {
    return {
      ...updateFilterData,
      selectedFields: newFieldIds.includes(all)
        ? selectFieldsFilter(eventSummary)
        : [],
    };
  }

  return updateFilterData;
};

const mapGamesByField = (games: IGame[], fields: IField[]) =>
  games.map(game => {
    const currentField = fields.find(field => field.id === game.fieldId);

    return { ...game, facilityId: currentField?.facilityId };
  });

export { getUnassignedTeams, mapGamesByField };
