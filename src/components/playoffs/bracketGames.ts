import { unionBy, findIndex } from 'lodash-es';
import { IGame } from 'components/common/matrix-table/helper';
import { IDivision } from 'common/models';
import { ITeamCard } from 'common/models/schedule/teams';

export interface IBracketGame {
  index: number;
  round: number;
  divisionId: string;
  // Seed
  awaySeedId?: number;
  homeSeedId?: number;
  // Team
  awayTeamId?: string;
  homeTeamId?: string;
  // Display Name
  awayDisplayName?: string;
  homeDisplayName?: string;
}

interface IFacilityData {
  division: string;
  facility: string;
}

export const bracketGames = () => {
  const games = [
    {
      index: 1,
      round: 1,
      awaySeedId: 1,
      homeSeedId: 8,
      divisionId: 'ADRL2021',
    },
    {
      index: 2,
      round: 1,
      awaySeedId: 2,
      homeSeedId: 7,
      divisionId: 'ADRL2021',
    },
    {
      index: 3,
      round: 1,
      awaySeedId: 3,
      homeSeedId: 6,
      divisionId: 'ADRL2021',
    },
    {
      index: 4,
      round: 1,
      awaySeedId: 4,
      homeSeedId: 5,
      divisionId: 'ADRL2021',
    },
    // round 2
    {
      index: 1,
      round: 2,
      awayDisplayName: 'Game Winner 1',
      homeDisplayName: 'Game Winner 2',
      divisionId: 'ADRL2021',
    },
    {
      index: 2,
      round: 2,
      awayDisplayName: 'Game Winner 3',
      homeDisplayName: 'Game Winner 4',
      divisionId: 'ADRL2021',
    },
    // round 3
    {
      index: 1,
      round: 3,
      awayDisplayName: 'Game Winner 5',
      homeDisplayName: 'Game Winner 6',
      divisionId: 'ADRL2021',
    },
  ];

  return games;
};

export const getFacilityData = (teamCards: ITeamCard[], games: IGame[]) => {
  const data = teamCards
    .map(item => ({
      division: item.divisionId,
      gameIds: item.games?.map(item2 => item2.id),
    }))
    .map(item => ({
      division: item.division,
      facility: games.find(game => item.gameIds?.includes(game.id))?.facilityId,
    }))
    .filter(item => item.division && item.facility);
  const divisionsPerFacilities = unionBy(data, 'division');
  return divisionsPerFacilities as IFacilityData[];
};

export const populateBracketGames = (
  games: IGame[],
  bracketGames: IBracketGame[],
  divisions: IDivision[],
  facilityData: IFacilityData[]
) => {
  const _bracketGames = [...bracketGames];
  const timeSlotRound = {};

  return games.map(item => {
    if (
      item.isPlayoff &&
      findIndex(facilityData, {
        facility: item.facilityId,
        division: _bracketGames[0]?.divisionId,
      }) >= 0 &&
      (!timeSlotRound[item.timeSlotId] ||
        timeSlotRound[item.timeSlotId] === _bracketGames[0].round)
    ) {
      const _bracketGame = _bracketGames.shift();
      const division = divisions.find(
        v => v.division_id === _bracketGame?.divisionId
      );
      timeSlotRound[item.timeSlotId] = _bracketGame?.round;
      return {
        ...item,
        awaySeedId: _bracketGame?.awaySeedId,
        homeSeedId: _bracketGame?.homeSeedId,
        awayDisplayName: _bracketGame?.awayDisplayName,
        homeDisplayName: _bracketGame?.homeDisplayName,
        divisionId: _bracketGame?.divisionId,
        divisionName: division?.short_name,
        divisionHex: division?.division_hex,
      };
    }
    return item;
  });
};
