import {
  ISchedulesGameWithNames,
  ISelectOption,
  IEventDetails,
  IFacility,
  IField,
  ITeam,
} from 'common/models';
import { orderBy } from 'lodash-es';
import moment from 'moment';
import { IMobileScoringGame, ScoresRaioOptions } from './common';
import { IPlayoffGame } from 'common/models/playoffs/bracket-game';
import { findTeam } from 'helpers';

const getGamesByScoreMode = (
  games: IMobileScoringGame[],
  scoreMode: ScoresRaioOptions
) => {
  let gamesByScoreMode;

  switch (scoreMode) {
    case ScoresRaioOptions.UNSCORED_GAMES:
      gamesByScoreMode = games.filter(
        it => !it.awayTeamScore && !it.homeTeamScore
      );

      break;

    case ScoresRaioOptions.ALL:
      return games;

    default:
      return games;
  }

  return gamesByScoreMode;
};

const getTeamWithFacility = (
  games: ISchedulesGameWithNames[],
  facilities: IFacility[],
  fields: IField[]
): IMobileScoringGame[] => {
  const teamWithFacility = games.map(game => {
    const currentField = fields.find(field => field.field_id === game.fieldId);

    const currentFacility = facilities.find(
      facility => facility.facilities_id === currentField?.facilities_id
    );

    return {
      ...game,
      facilityId: currentFacility?.facilities_id || null,
      facilityName: currentFacility?.facilities_description || null,
    };
  });

  return teamWithFacility;
};

const getEventOptions = (events: IEventDetails[]) => {
  const eventOptions = events.map(it => ({
    label: it.event_name,
    value: it.event_id,
  })) as ISelectOption[];

  const sortedEventOptions = orderBy(eventOptions, 'label', 'asc');

  return sortedEventOptions;
};

const geEventDates = (games: ISchedulesGameWithNames[]) => {
  const dates = Array.from(new Set(games.map(it => it.gameDate)));

  return dates;
};

const getDayOptions = (days: string[]): ISelectOption[] => {
  const dayOptions = days.map(day => ({
    label: moment(day).format('L'),
    value: day,
  }));

  return dayOptions;
};

const getTabTimes = (
  activeDay: string | null,
  games: ISchedulesGameWithNames[]
) => {
  if (!activeDay) {
    return [];
  }

  const timesByDay = games.reduce((acc, game) => {
    return game.gameDate === activeDay ? [...acc, game.startTime] : acc;
  }, [] as string[]);

  const uniqueGameTimes = Array.from(new Set(timesByDay));

  const sortedTimeSlots = orderBy(uniqueGameTimes, undefined, 'asc');

  return sortedTimeSlots;
};

const mapScoringBracketsWithNames = (
  teams: ITeam[],
  facilities: IFacility[],
  fields: IField[],
  bracketGames: IPlayoffGame[]
): IMobileScoringGame[] => {
  const getMapBracketGames = bracketGames.map(bracketGame => {
    const currentField = fields.find(
      field => field.field_id === bracketGame.field_id
    );
    const currentFacility = facilities.find(
      facility => facility.facilities_id === currentField?.facilities_id
    );

    return {
      id: bracketGame.game_id,
      facilityId: currentFacility?.facilities_id || null,
      facilityName: currentFacility?.facilities_description || null,
      fieldId: bracketGame.field_id || '',
      fieldName: currentField?.field_name || 'Field',
      awayTeamId: bracketGame.away_team_id,
      awayTeamName: bracketGame.away_team_id
        ? findTeam(bracketGame.away_team_id, teams)!.short_name
        : null,
      awayTeamScore: bracketGame.away_team_score,
      homeTeamId: bracketGame.home_team_id,
      homeTeamName: bracketGame.home_team_id
        ? findTeam(bracketGame.home_team_id, teams)!.short_name
        : null,
      homeTeamScore: bracketGame.home_team_score,
      gameDate: bracketGame.game_date as string,
      startTime: bracketGame.start_time || '',
      createTime: bracketGame.created_datetime,
      updatedTime: bracketGame.updated_datetime,
      isPlayoff: true,
      awaySeedId: bracketGame.seed_num_away || null,
      homeSeedId: bracketGame.seed_num_home || null,
      awayDependsUpon: bracketGame.away_depends_upon || null,
      homeDependsUpon: bracketGame.home_depends_upon || null,
      round: bracketGame.round_num || null,
    };
  });

  return getMapBracketGames;
};

export {
  getGamesByScoreMode,
  getDayOptions,
  getTabTimes,
  geEventDates,
  getEventOptions,
  getTeamWithFacility,
  mapScoringBracketsWithNames,
};
