import { orderBy, findIndex } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from '../matrix-table/helper';
import { IScheduleFilter, DayTypes, DefaulSelectFalues } from './types';
import { MultipleSelectionField } from '../multiple-search-select';
import { IDivision, IEventSummary } from 'common/models';
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

const checkTeams = (game: IGame, teamIds: string[]) => {
  const { awayTeam, homeTeam } = game;
  return teamIds.includes(awayTeam?.id!) || teamIds.includes(homeTeam?.id!);
};

const checkFields = (game: IGame, fieldIds: string[]) => {
  return fieldIds.includes(game.fieldId);
};

export const mapGamesByFilter = (games: IGame[], filter: IScheduleFilter) => {
  const { selectedDivisions, selectedTeams, selectedFields } = filter;

  const divisionIds = mapValues(selectedDivisions);
  const teamIds = mapValues(selectedTeams);
  const fieldIds = mapValues(selectedFields);

  const filteredGamesIds = games
    .filter(
      game =>
        (!divisionIds.length || checkDivisions(game, divisionIds)) &&
        (!teamIds.length || checkTeams(game, teamIds)) &&
        (!fieldIds.length || checkFields(game, fieldIds))
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
  { label: 'All', value: DefaulSelectFalues.ALL },
  ...orderBy(divisions, SortByFilesTypes.DIVISIONS).map(division => ({
    label: division[SortByFilesTypes.DIVISIONS],
    value: division.division_id,
  })),
];

export const selectTeamsFilter = (teamCards: ITeamCard[]) => [
  { label: 'All', value: DefaulSelectFalues.ALL },
  ...orderBy(teamCards, 'divisionShortName').map(team => ({
    label: team.name,
    value: team.id,
  })),
];

export const selectFieldsFilter = (eventSummary: IEventSummary[]) => [
  { label: 'All', value: DefaulSelectFalues.ALL },
  ...orderBy(eventSummary, SortByFilesTypes.FACILITIES_INITIALS).map(es => ({
    label: `${es[SortByFilesTypes.FACILITIES_INITIALS]} - ${es.field_name}`,
    value: es.field_id,
  })),
];

export const applyFilters = (
  divisions: IDivision[],
  teamCards: ITeamCard[],
  eventSummary: IEventSummary[]
) => {
  const selectedDivisions = selectDivisionsFilter(divisions);

  const selectedTeams = selectTeamsFilter(teamCards);

  const selectedFields = selectFieldsFilter(eventSummary);

  return {
    selectedDay: DayTypes.DAY_ONE,
    selectedDivisions,
    selectedTeams,
    selectedFields,
  };
};

export const handleFilterData = (
  filter: IScheduleFilter,
  newFilter: IScheduleFilter,
  divisions: IDivision[],
  teamCards: ITeamCard[],
  eventSummary: IEventSummary[]
) => {
  const divisionIds = mapValues(filter.selectedDivisions);
  const teamIds = mapValues(filter.selectedTeams);
  const fieldIds = mapValues(filter.selectedFields);

  const newDivisionIds = mapValues(newFilter.selectedDivisions);
  const newTeamIds = mapValues(newFilter.selectedTeams);
  const newFieldIds = mapValues(newFilter.selectedFields);

  const updateFilterData: IScheduleFilter = newFilter;

  const all = DefaulSelectFalues.ALL;

  /* DIVISION ALL CHECKING */

  if (divisionIds.includes(all) && !newDivisionIds.includes(all)) {
    return {
      ...updateFilterData,
      selectedDivisions: [],
    };
  }

  if (!divisionIds.includes(all) && newDivisionIds.includes(all)) {
    return {
      ...updateFilterData,
      selectedDivisions: selectDivisionsFilter(divisions),
    };
  }

  /* TEAMS ALL CHECKING */

  if (teamIds.includes(all) && !newTeamIds.includes(all)) {
    return {
      ...updateFilterData,
      selectedTeams: [],
    };
  }

  if (!teamIds.includes(all) && newTeamIds.includes(all)) {
    return {
      ...updateFilterData,
      selectedTeams: selectTeamsFilter(teamCards),
    };
  }

  /* FIELDS ALL CHECKING */

  if (fieldIds.includes(all) && !newFieldIds.includes(all)) {
    return {
      ...updateFilterData,
      selectedFields: [],
    };
  }

  if (!fieldIds.includes(all) && newFieldIds.includes(all)) {
    return {
      ...updateFilterData,
      selectedFields: selectFieldsFilter(eventSummary),
    };
  }

  return updateFilterData;
};

export { getUnassignedTeams };
