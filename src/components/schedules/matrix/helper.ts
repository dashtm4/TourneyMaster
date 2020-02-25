import { ITeam, IField, ITimeSlot } from '..';

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
  const gamesNumber = fieldsNumber * timeSlotsNumber; // Math.ceil(teamsNumber / 2) * timeSlotsNumber;

  // console.log('timeSlotsNumber', timeSlotsNumber, teamsNumber);

  const games: IGame[] = [];
  for (let i = 1; i <= gamesNumber; i++) {
    const timeSlotId = Math.ceil(i / fieldsNumber) - 1;
    const fieldId = i - Math.ceil(timeSlotId * fieldsNumber) - 1;

    if (i <= 5) {
      games.push({
        id: i,
        timeSlotId,
        fieldId,
        awayTeam: {
          id: i,
          name: 'Team # ' + i,
          divisionId: 0,
          isPremier: false,
          startTime: '08:00',
        },
        homeTeam: {
          id: i + 5,
          name: 'Team # ' + (i + 5),
          divisionId: 0,
          isPremier: false,
          startTime: '08:00',
        },
      });
      continue;
    }
    games.push({
      id: i,
      timeSlotId,
      fieldId,
    });
  }

  return {
    gameTimeSlots: timeSlotsNumber /* Math.ceil(gamesNumber / fieldsNumber) */,
    gameFields: gamesNumber <= fieldsNumber ? gamesNumber : fieldsNumber,
    games,
  };
};
