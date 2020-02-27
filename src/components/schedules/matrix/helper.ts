import { ITeam, IField, ITimeSlot } from '..';
import { ITeamCard } from './index';
import { DropParams } from './dnd/drop';

export interface IGame {
  id: number;
  homeTeam?: ITeam;
  awayTeam?: ITeam;
  timeSlotId: number;
  fieldId: number;
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
