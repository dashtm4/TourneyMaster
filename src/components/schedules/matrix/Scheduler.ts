import moment from 'moment';
import { getTimeFromString } from 'helpers/stringTimeOperations';
import { IGame, TeamPositionEnum, arrayAverageOccurrence } from './helper';
import { ITimeSlot, IField } from '..';
import { ITeamCard } from '.';

interface IConditions {
  isPremier?: boolean;
}

interface ITeamsInPlay {
  [key: string]: (number | undefined)[];
}

interface IFacilityData {
  [key: string]: {
    divisionId?: number;
    gamesNum?: number;
  };
}

export default class Scheduler {
  fields: IField[];
  teamCards: ITeamCard[];
  games: IGame[];
  timeSlots: ITimeSlot[];
  updatedGames: IGame[];
  teamsInPlay: ITeamsInPlay;
  facilityData: IFacilityData;
  avgStartTime?: string;

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
    this.updatedGames = [];
    this.teamsInPlay = {};
    this.facilityData = {};
    this.calculateGamesForFacilities();
    this.calculateAvgStartTime();
    this.populateGameData();
    this.calculateTeamData();
  }

  populateGameData = () => {
    this.updatedGames = [...this.games].map(game => ({
      ...game,
      isPremier: !!this.fields.find(
        field => field.id === game.fieldId && field.isPremier
      ),
      startTime: this.timeSlots.find(
        timeSlot => timeSlot.id === game.timeSlotId
      )?.time,
    }));
  };

  calculateTeamData = () => {
    [...this.teamCards, ...this.teamCards].map(teamCard => {
      const foundGame = this.findGame(teamCard, {
        isPremier: teamCard.isPremier,
      });

      if (foundGame) {
        const updatedTeamCard = this.updateTeam(teamCard, foundGame);
        this.setTeamInPlay(teamCard, foundGame);
        this.setDivisionPerFacility(teamCard, foundGame);
        console.log('facilityData', this.facilityData);
        this.updateGame(foundGame, updatedTeamCard);
      }
    });
  };

  findGame = (teamCard: ITeamCard, conditions?: IConditions) => {
    const teamGames = this.updatedGames.filter(
      ({ awayTeam, homeTeam }) =>
        awayTeam?.id === teamCard.id || homeTeam?.id === teamCard.id
    );

    const teamTimeSlots = teamGames.map(game => game.timeSlotId);

    return this.updatedGames.find(
      game =>
        game.isPremier === conditions?.isPremier &&
        (!game.awayTeam || !game.homeTeam) &&
        game.awayTeam?.id !== teamCard.id &&
        game.homeTeam?.id !== teamCard.id &&
        this.gameStartsInProperTime(game, teamCard) &&
        !teamTimeSlots.includes(game.timeSlotId) &&
        !teamTimeSlots.includes(game.timeSlotId - 1) &&
        !this.teamInPlayGames(teamCard, game)
    );
  };

  updateGame = (foundGame: IGame, teamCard: ITeamCard) => {
    this.updatedGames = this.updatedGames.map(game =>
      game.id === foundGame.id
        ? { ...game, [TeamPositionEnum[teamCard.teamPosition!]]: teamCard }
        : game
    );
  };

  updateTeam = (teamCard: ITeamCard, game: IGame) => {
    return {
      ...teamCard,
      fieldId: game.fieldId,
      timeSlotId: game.timeSlotId,
      teamPosition: game.awayTeam
        ? TeamPositionEnum.homeTeam
        : TeamPositionEnum.awayTeam,
    };
  };

  gameStartsInProperTime = (game: IGame, teamCard: ITeamCard) => {
    const gameTime = getTimeFromString(game.startTime!, 'minutes');
    const teamTime = getTimeFromString(
      moment(teamCard.startTime).format('hh:mm'),
      'minutes'
    );
    return gameTime >= teamTime;
  };

  teamInPlayGames = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam, homeTeam } = game;
    const id = awayTeam?.id !== undefined ? awayTeam.id : homeTeam?.id;
    return this.teamsInPlay[teamCard.id]?.includes(id);
  };

  setTeamInPlay = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam, homeTeam } = game;
    const newTeamId = [
      awayTeam?.id !== undefined ? awayTeam.id : homeTeam?.id,
    ].filter(el => el !== undefined && el >= 0);

    this.teamsInPlay[teamCard.id] = [
      ...(this.teamsInPlay[teamCard.id] || []),
      ...newTeamId,
    ];
  };

  getDivisionPerFacility = (game: IGame) => {
    const facilityId = this.fields.find(field => field.id === game.fieldId)
      ?.facilityId;
    return this.facilityData[facilityId!]?.divisionId;
  };

  setDivisionPerFacility = (teamCard: ITeamCard, game: IGame) => {
    const divisionId = teamCard.divisionId;
    const facilityId = this.fields.find(field => field.id === game.fieldId)
      ?.facilityId;

    if (facilityId && !this.facilityData[facilityId]?.divisionId) {
      this.facilityData = {
        ...this.facilityData,
        [facilityId]: {
          ...(this.facilityData[facilityId] || []),
          divisionId,
        },
      };
    }
  };

  calculateGamesForFacilities = () => {
    const facilities: number[] = [];
    const facilitiesFields = {};

    new Set(this.fields.map(field => field.facilityId)).forEach(facility => {
      facilities.push(facility);
    });

    this.fields.forEach(field =>
      facilitiesFields[field.facilityId]
        ? facilitiesFields[field.facilityId].push(field.id)
        : (facilitiesFields[field.facilityId] = [field.id])
    );

    Object.keys(facilitiesFields).forEach(key => {
      this.facilityData[key] = {
        ...this.facilityData[key],
        gamesNum: facilitiesFields[key].length * this.timeSlots.length,
      };
    });

    console.log('facilityData', this.facilityData);
  };

  calculateAvgStartTime = () => {
    const timeStarts = this.teamCards.map(tc => tc.startTime);
    this.avgStartTime = arrayAverageOccurrence(timeStarts);
  };
}
