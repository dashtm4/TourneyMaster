import moment from 'moment';
import { getTimeFromString } from 'helpers/stringTimeOperations';
import { IGame, TeamPositionEnum, arrayAverageOccurrence } from './helper';
import { ITimeSlot, IField } from '..';
import { ITeamCard } from '.';

interface IConditions {
  isPremier?: boolean;
  divisionId?: number;
}

interface ITeamPlayed {
  [key: string]: (number | undefined)[];
}

export default class Scheduler {
  fields: IField[];
  teamCards: ITeamCard[];
  games: IGame[];
  timeSlots: ITimeSlot[];
  updatedTeamCards: ITeamCard[];
  updatedGames: IGame[];
  teamPlayedGames: ITeamPlayed;
  avgStartTime?: number;

  constructor(
    fields: IField[],
    teamCards: ITeamCard[],
    games: IGame[],
    timeSlots: ITimeSlot[]
  ) {
    this.fields = fields;
    this.teamCards = teamCards;
    this.games = games;
    this.timeSlots = timeSlots;
    this.updatedTeamCards = [];
    this.updatedGames = [];
    this.teamPlayedGames = {};

    this.calculateAvgStartTime();
    this.populateGameData();
    this.calculateTeamCards();
  }

  private populateGameData = () => {
    this.updatedGames = this.games.map(game => ({
      ...game,
      isPremier: !!this.fields.find(
        field => field.id === game.fieldId && field.isPremier
      ),
      startTime: this.timeSlots.find(
        timeSlot => timeSlot.id === game.timeSlotId
      )?.time,
    }));
  };

  private calculateTeamCards = () => {
    [...this.teamCards, ...this.teamCards].map(teamCard => {
      const conditions = {
        isPremier: teamCard.isPremier,
      };
      const foundGame = this.findGame(teamCard, conditions);

      if (foundGame) {
        const newTeamCard = this.updateTeamCard(teamCard, foundGame);
        this.updateTeamPlayedGames(newTeamCard, foundGame);
        this.updateGames(foundGame, newTeamCard);
      }
    });
  };

  private findGame = (teamCard: ITeamCard, conditions?: IConditions) => {
    const teamGames = this.updatedGames.filter(
      ({ awayTeam, homeTeam }) =>
        awayTeam?.id === teamCard.id || homeTeam?.id === teamCard.id
    );
    const teamTimeSlots = teamGames.map(game => game.timeSlotId);

    return this.updatedGames.find(
      game =>
        // IF GAME IS/NOT PREMIER
        game.isPremier === conditions?.isPremier &&
        // IF GAME HAS ATLEAST ONE TEAM FREE
        (!game.awayTeam || !game.homeTeam) &&
        // IF GAME DOESN'T HAVE THIS TEAM ALREADY
        game.awayTeam?.id !== teamCard.id &&
        game.homeTeam?.id !== teamCard.id &&
        // IF GAME STARTS IN ACCEPTED TIME
        this.teamStartsInRightTime(teamCard, game) &&
        // IF GAME TIMESLOT IS NOT IN USE BY THE TEAM
        !teamTimeSlots.includes(game.timeSlotId) &&
        !teamTimeSlots.includes(game.timeSlotId - 1) &&
        // IF THE TEAM HASN'T PLAYED WITH ANOTHER TEAM HERE
        !this.gameTeamInPlayedGames(teamCard, game) &&
        // IF GAME FACILITY CORRESPONDS TEAM DIVISION
        true
    );
  };

  private updateTeamCard = (teamCard: ITeamCard, foundGame: IGame) => {
    return {
      ...teamCard,
      fieldId: foundGame.fieldId,
      timeSlotId: foundGame.timeSlotId,
      teamPosition: foundGame.awayTeam
        ? TeamPositionEnum.homeTeam
        : TeamPositionEnum.awayTeam,
    };
  };

  private updateGames = (foundGame: IGame, teamCard: ITeamCard) => {
    this.updatedGames = this.updatedGames.map(game =>
      game.id === foundGame.id
        ? {
            ...game,
            [TeamPositionEnum[teamCard.teamPosition!]]: teamCard,
          }
        : game
    );
  };

  private calculateAvgStartTime() {
    const timeStarts = this.teamCards.map(tc => tc.startTime);
    this.avgStartTime = arrayAverageOccurrence(timeStarts);
  }

  private gameTeamInPlayedGames = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam, homeTeam } = game;
    const id = awayTeam?.id !== undefined ? awayTeam.id : homeTeam?.id;
    const result = this.teamPlayedGames[teamCard.id]?.includes(id);
    return result;
  };

  private updateTeamPlayedGames = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam, homeTeam } = game;
    const itemsToSave = [awayTeam?.id, homeTeam?.id].filter(
      el => el !== undefined && el >= 0
    );
    this.teamPlayedGames[teamCard.id] = [
      ...(this.teamPlayedGames[teamCard.id] || []),
      ...itemsToSave,
    ];
  };

  private teamStartsInRightTime = (teamCard: ITeamCard, game: IGame) => {
    const gameStartTimeMin = getTimeFromString(game.startTime!, 'minutes');
    const teamStartTimeMin = getTimeFromString(
      moment(teamCard.startTime).format('hh:mm'),
      'minutes'
    );
    return gameStartTimeMin >= teamStartTimeMin;
  };
}
