import { unionBy, orderBy } from 'lodash-es';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from 'components/common/matrix-table/helper';

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

  const topFacilityData = orderBy(data2, ['firstRoundTimeSlots'], 'desc')[0];
  const timeSlotsRequired = recursor(
    rounds,
    [],
    topFacilityData.games,
    topFacilityData.fields!
  );

  return {
    fields,
    timeSlots,
    divisions,
  };
};
