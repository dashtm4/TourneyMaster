import moment from 'moment';
import { IField, ITimeSlot } from '..';
import { ITeamCard } from './index';
import { IGame, arrayAverageOccurrence } from './helper';
import { getTimeFromString } from 'helpers/stringTimeOperations';

interface IGameExt extends IGame {
  startTime?: string;
}

interface ITeamPlayed {
  [key: string]: number[];
}

interface Params {
  fields: IField[];
  timeSlots: ITimeSlot[];
  teamCards: ITeamCard[];
  games: IGame[];
}

const teamPlayedGames: ITeamPlayed = {};

const populateGameData = (
  games: IGameExt[],
  fields: IField[],
  timeSlots: ITimeSlot[]
) =>
  games.map(game => ({
    ...game,
    isPremier: Boolean(
      fields.find(field => field.id === game.fieldId && field.isPremier)
    ),
    startTime: timeSlots.find(timeSlot => timeSlot.id === game.timeSlotId)
      ?.time,
  }));

const findPremierGame = (games: IGameExt[], teamCard: ITeamCard) =>
  games.find(
    (game: IGameExt) =>
      game.isPremier && teamCard.isPremier && (!game.awayTeam || !game.homeTeam)
  );

const findRegularGame = (
  games: IGameExt[],
  teamCard: ITeamCard,
  teamCards: ITeamCard[]
) => {
  const tcId = teamCard.id;
  // Total games played by this team
  const gamesPlayed = games.filter(
    ({ awayTeam, homeTeam }) => awayTeam?.id === tcId || homeTeam?.id === tcId
  );

  // Timeslots and fields played by this team
  const timeSlotsPlayed = gamesPlayed.map(game => game.timeSlotId);
  const fieldsPlayed = gamesPlayed.map(game => game.fieldId);

  // Average start time
  const timeStarts = teamCards.map(tc => tc.startTime);
  const avgStartTime = arrayAverageOccurrence(timeStarts);

  const foundGame = games.find(
    game =>
      // IF game is not premier
      !game.isPremier &&
      // IF game has atleast one team free
      (!game.awayTeam || !game.homeTeam) &&
      // IF game doesn't have this team already
      game.awayTeam?.id !== tcId &&
      game.homeTeam?.id !== tcId &&
      // IF game starts before/right this team can start
      getTimeFromString(game.startTime!, 'minutes') >=
        getTimeFromString(
          moment(teamCard.startTime).format('hh:mm'),
          'minutes'
        ) &&
      // IF timeslot is not in use by this team
      !timeSlotsPlayed.includes(game.timeSlotId) &&
      !timeSlotsPlayed.includes(game.timeSlotId - 1) &&
      // IF this team hasn't played with team in this game yet
      !teamPlayedGames[tcId]?.includes(
        game.awayTeam?.id || game?.homeTeam?.id!
      ) &&
      // IF this game has common start time
      teamCard.startTime === avgStartTime
  );

  teamPlayedGames[tcId] = [
    ...(teamPlayedGames[tcId] || []),
    foundGame?.awayTeam?.id || -1,
    foundGame?.homeTeam?.id || -1,
  ].filter((el: number) => el >= 0);

  return foundGame;
};

const findGame = (
  games: IGame[],
  teamCard: ITeamCard,
  teamCards: ITeamCard[]
) => {
  const isTeamPremier = teamCard.isPremier;
  if (isTeamPremier) {
    return findPremierGame(games, teamCard);
  }
  return findRegularGame(games, teamCard, teamCards);
};

export default (params: Params) => {
  const { fields, teamCards: teams, games, timeSlots } = params;
  const updatedTeamCards: ITeamCard[] = [];
  let updatedGames: IGameExt[] = [...games];

  updatedGames = populateGameData(games, fields, timeSlots);

  [...teams, ...teams, ...teams, ...teams].forEach(teamCard => {
    /*
      1. Find a game to set in the team
      2. Update games arr with latest data
      3. Update teams arr with the new team object
    */

    const foundGame = findGame(updatedGames, teamCard, teams);

    updatedGames = updatedGames.map(game =>
      game.id === foundGame?.id
        ? {
            ...game,
            [foundGame?.awayTeam ? 'homeTeam' : 'awayTeam']: teamCard,
          }
        : game
    );

    const newTeamCard = {
      ...teamCard,
      fieldId: foundGame?.fieldId,
      timeSlotId: foundGame?.timeSlotId,
      teamPosition: foundGame?.awayTeam ? 2 : 1,
    };

    updatedTeamCards.push(newTeamCard);
  });

  console.log('TeamPlayedGames', teamPlayedGames);

  return updatedTeamCards;

  /*
   * Premier teams can only play on Premier fields
   * Teams from One Division can only play on One Facility
   * Teams can only play one game for one TimeSlot
   * Teams can only play after defined start time
   * Teams cannot play back-to-back games
   */
};
