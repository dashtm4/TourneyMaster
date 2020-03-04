import { ITeam, IField, ITimeSlot } from '..';
import { ITeamCard } from './index';
import { DropParams } from './dnd/drop';

export enum TeamPositionEnum {
  'awayTeam' = 1,
  'homeTeam' = 2,
}

export interface IGame {
  id: number;
  startTime?: string;
  facilityId?: number;
  homeTeam?: ITeamCard;
  awayTeam?: ITeamCard;
  timeSlotId: number;
  fieldId: number;
  isPremier?: boolean;
}

export interface IDefinedGames {
  gameTimeSlots: number;
  gameFields: number;
  games: IGame[];
}

export const defineGames = (
  fields: IField[],
  timeSlots: ITimeSlot[],
  _teams: ITeam[]
): IDefinedGames => {
  // const teamsNumber = teams.length;
  const fieldsNumber = fields.length;
  const timeSlotsNumber = timeSlots.length;
  const gamesNumber = fieldsNumber * timeSlotsNumber;

  const games: IGame[] = [];
  for (let i = 1; i <= gamesNumber; i++) {
    const timeSlotId = Math.ceil(i / fieldsNumber) - 1;
    const fieldId = i - Math.ceil(timeSlotId * fieldsNumber) - 1;

    games.push({
      id: i,
      timeSlotId,
      fieldId,
    });
  }

  return {
    gameTimeSlots: timeSlotsNumber,
    gameFields: gamesNumber <= fieldsNumber ? gamesNumber : fieldsNumber,
    games,
  };
};

export const selectProperGamesPerTimeSlot = (
  timeSlot: ITimeSlot,
  games: IGame[]
) => games.filter((game: IGame) => game.timeSlotId === timeSlot.id);

export const updateTeamCards = (params: DropParams, teamCards: ITeamCard[]) => {
  const { id, fieldId, timeSlotId, teamPosition } = params;
  return teamCards.map((teamCard: ITeamCard) => {
    let updatedTeamCard = teamCard;
    if (
      teamCard.fieldId === fieldId &&
      teamCard.timeSlotId === timeSlotId &&
      teamCard.teamPosition === teamPosition
    ) {
      delete updatedTeamCard.fieldId;
      delete updatedTeamCard.timeSlotId;
      delete updatedTeamCard.teamPosition;
      return updatedTeamCard;
    }
    if (teamCard.id === id) {
      updatedTeamCard = {
        ...updatedTeamCard,
        fieldId,
        timeSlotId,
        teamPosition,
      };
      return updatedTeamCard;
    }

    return teamCard;
  });
};

export const settleTeamsPerGames = (games: IGame[], teamCards: ITeamCard[]) =>
  games.map((game: IGame) => {
    const awayTeam = teamCards.find(
      (teamCard: ITeamCard) =>
        teamCard.fieldId === game.fieldId &&
        teamCard.timeSlotId === game.timeSlotId &&
        teamCard.teamPosition === 1
    );

    const homeTeam = teamCards.find(
      (teamCard: ITeamCard) =>
        teamCard.fieldId === game.fieldId &&
        teamCard.timeSlotId === game.timeSlotId &&
        teamCard.teamPosition === 2
    );

    return {
      ...game,
      awayTeam,
      homeTeam,
    };
  });

export const arrayAverageOccurrence = (array: any[]) => {
  if (array.length === 0) return null;
  const modeMap = {};
  let maxCount = 1;
  let modes = [];

  for (var i = 0; i < array.length; i++) {
    const el = array[i];

    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;

    if (modeMap[el] > maxCount) {
      modes = [el];
      maxCount = modeMap[el];
    } else if (modeMap[el] === maxCount) {
      modes.push(el);
      maxCount = modeMap[el];
    }
  }

  return modes[0];
};

export const getSortedByGamesNum = (data: any) =>
  Object.keys(data).sort((a, b) =>
    data[a].gamesNum < data[b].gamesNum ? 1 : -1
  );

export const getSortedDesc = (data: any) =>
  Object.keys(data).sort((a, b) => (data[a] < data[b] ? 1 : -1));
