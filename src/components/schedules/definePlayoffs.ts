import { unionBy, orderBy, findIndex } from 'lodash-es';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from 'components/common/matrix-table/helper';
import { IEventDetails, IDivision, ISchedulesDetails } from 'common/models';

export default (
  fields: IField[],
  timeSlots: ITimeSlot[],
  divisions: IScheduleDivision[],
  facilities: IScheduleFacility[],
  teamCards: ITeamCard[],
  games: IGame[]
) => {
  const rounds = 3;

  /* 1. Number of fields for each facility */
  const facilitiesCapacity = facilities.map(item => ({
    id: item.id,
    fields: item.fields,
  }));

  /* 2. Map of divisions play on facilities on the last day */
  const data = teamCards
    .map(item => ({
      division: item.divisionId,
      gameIds: item.games?.map(item2 => item2.id),
    }))
    .map(item => ({
      division: item.division,
      games: 4,
      facility: games.find(game => item.gameIds?.includes(game.id))?.facilityId,
    }));
  const divisionsPerFacilities = unionBy(data, 'division');

  /* 3. Calculate number of rows for first round per facility */
  const data2 = facilitiesCapacity
    .map(item => ({
      ...item,
      games: divisionsPerFacilities
        .filter(v => v.facility === item.id)
        .reduce((a, b) => a + b.games, 0),
    }))
    .map(item => ({
      ...item,
      firstRoundTimeSlots: Math.ceil(item.games / (item.fields || item.games)),
    }));

  const topFacilityData = orderBy(data2, ['firstRoundTimeSlots'], 'desc')[0];
  recursor(rounds, [], topFacilityData.games, topFacilityData.fields!);

  return {
    fields,
    timeSlots,
    divisions,
  };
};

const calculateRoundsNumber = (_numTeamsBracket: number) => {
  return 3;
};

const recursor = (
  rounds: number,
  timeSlots: number[],
  games: number,
  fields: number
): any => {
  if (timeSlots.length) {
    timeSlots.push(Math.ceil(Math.ceil(games / 2) / fields));
  } else {
    timeSlots.push(Math.ceil(games / fields));
  }

  if (timeSlots.length === rounds) {
    return timeSlots.reduce((a, b) => a + b, 0);
  }
  return recursor(rounds, timeSlots, games, fields);
};

export const predictPlayoffTimeSlots = (
  fields: IField[],
  timeSlots: ITimeSlot[],
  divisions: IScheduleDivision[] | IDivision[],
  event: IEventDetails
) => {
  const { num_teams_bracket } = event;
  const rounds = calculateRoundsNumber(num_teams_bracket!);
  const timeSlotsLength = timeSlots.length;
  const divisionsLength = divisions.length;
  const fieldsLength = fields.length;
  const divisionFirstRoundGames = 4;

  const firstRoundGamesTotal = divisionsLength * divisionFirstRoundGames;
  const timeSlotsRequired = recursor(
    rounds,
    [],
    firstRoundGamesTotal,
    fieldsLength
  );

  const playoffTimeSlots = timeSlots.slice(
    timeSlotsLength - timeSlotsRequired,
    timeSlotsLength
  );

  return playoffTimeSlots;
};

export const populateDefinedGamesWithPlayoffState = (
  games: IGame[],
  playoffTimeSlots: ITimeSlot[]
) => {
  const populatedGames = games.map(item => ({
    ...item,
    isPlayoff: findIndex(playoffTimeSlots, { id: item.timeSlotId }) >= 0,
  }));

  return populatedGames;
};

export const adjustPlayoffTimeOnLoad = (
  schedulesDetails: ISchedulesDetails[],
  fields: IField[],
  timeSlots: ITimeSlot[],
  divisions: IScheduleDivision[] | IDivision[],
  event: IEventDetails,
  day: string
) => {
  const sdStartTimes = schedulesDetails
    .filter(
      item => item.game_date === day && (item.home_team_id || item.away_team_id)
    )
    .map(item => item.game_time);
  const lastStartTime = orderBy(sdStartTimes, 'desc')[0];

  const lastGameTimeSlot = timeSlots.find(item => item.time === lastStartTime)
    ?.id;

  if (!lastGameTimeSlot) return;

  const playoffTimeSlots = predictPlayoffTimeSlots(
    fields,
    timeSlots,
    divisions,
    event
  );

  const start = lastGameTimeSlot + 1;
  const end = start + playoffTimeSlots.length;

  return timeSlots.slice(start, end);
};