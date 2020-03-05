import moment from 'moment';
import { union } from 'lodash-es';
import { getTimeFromString } from 'helpers/stringTimeOperations';
import {
  IGame,
  TeamPositionEnum,
  arrayAverageOccurrence,
  getSortedByGamesNum,
  getSortedDesc,
} from './helper';
import { ITimeSlot, IField } from '..';
import { ITeamCard } from '.';

interface IConditions {
  isPremier?: boolean;
}

interface IKeyId {
  [key: string]: (number | undefined)[];
}

interface IFacilityData {
  [key: string]: {
    divisionIds?: number[];
    gamesPerTeam?: number;
    gamesNum?: number;
  };
}

export default class Scheduler {
  fields: IField[];
  teamCards: ITeamCard[];
  games: IGame[];
  timeSlots: ITimeSlot[];
  updatedGames: IGame[];
  teamsInPlay: IKeyId;
  facilityData: IFacilityData;
  avgStartTime?: string;
  teamGameNum?: number;
  unusedFields?: number[];
  poolsData: IKeyId;
  minGameNum = 3;
  maxGameNum = 5;

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
    this.poolsData = {};
    this.calculateTeamGameNum();
    this.setTeamsPerPools();
    this.calculateGamesForFacilities();
    this.calculateAvgStartTime();
    this.populateGameData();
    this.calculateTeamData();
    this.handleSingleTeamGames();
    this.calculateEmptyFields();
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
      facilityId: this.fields.find(field => field.id === game.fieldId)
        ?.facilityId,
    }));
  };

  calculateTeamData = () => {
    [...this.teamCards].map(teamCard => {
      const conditions = { isPremier: teamCard.isPremier };
      const foundGame = this.findGame(teamCard, conditions);

      if (foundGame) {
        const updatedTeamCard = this.updateTeam(teamCard, foundGame);
        this.setTeamInPlay(teamCard, foundGame);
        this.updateGame(foundGame, updatedTeamCard);
      }
    });

    this.incrementGamePerTeam();

    const currentGamesPerTeam = this.getGamesPerTeam();

    if (
      this.teamGameNum &&
      currentGamesPerTeam < this.teamGameNum &&
      currentGamesPerTeam < this.maxGameNum
    ) {
      this.calculateTeamData();
    }
  };

  incrementGamePerTeam = () => {
    Object.keys(this.facilityData).forEach(
      key =>
        (this.facilityData[key].gamesPerTeam =
          this.facilityData[key].gamesPerTeam! + 1 || 1)
    );
  };

  getGamesPerTeam = () => {
    let returnNum;
    Object.keys(this.facilityData).forEach(key =>
      this.facilityData[key]?.gamesPerTeam
        ? (returnNum = this.facilityData[key]?.gamesPerTeam)
        : null
    );
    return returnNum || -1;
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
        !this.teamInPlayGames(teamCard, game) &&
        this.checkForPoolsConsistency(teamCard, game) &&
        this.facilityData[game.facilityId!]?.divisionIds?.includes(
          teamCard.divisionId
        )
    );
  };

  updateGame = (foundGame: IGame, teamCard: ITeamCard) => {
    this.updatedGames = this.updatedGames.map(game =>
      game.id === foundGame.id
        ? { ...game, [TeamPositionEnum[teamCard.teamPosition!]]: teamCard }
        : game
    );
  };

  calculateTeamGameNum = () => {
    const timeSlotsNum = this.timeSlots.length;
    this.teamGameNum = timeSlotsNum / 2;
  };

  setTeamsPerPools = () => {
    this.teamCards.map(teamCard => {
      this.poolsData[teamCard.poolId] = [
        ...(this.poolsData[teamCard.poolId] || []),
        teamCard.id,
      ];
    });
  };

  checkForPoolsConsistency = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam } = game;
    return awayTeam
      ? !!this.poolsData[teamCard.poolId].includes(awayTeam?.id)
      : true;
  };

  handleSingleTeamGames = () => {
    const singleTeamCards: (ITeamCard | undefined)[] = [];
    this.updatedGames = this.updatedGames.map(game => {
      const { awayTeam, homeTeam } = game;
      if (!(awayTeam && homeTeam) && (awayTeam || homeTeam)) {
        singleTeamCards.push(awayTeam || homeTeam);
        delete game.awayTeam;
        delete game.homeTeam;
      }
      return game;
    });

    const teams: { [key: string]: ITeamCard | undefined } = {};
    singleTeamCards.forEach(
      teamCard =>
        (teams[teamCard?.id!] = singleTeamCards.find(
          tc =>
            !this.teamsInPlay[tc?.id!].includes(teamCard?.id!) &&
            !this.teamsInPlay[teamCard?.id!].includes(tc?.id!) &&
            teamCard?.poolId === tc?.poolId &&
            tc?.isPremier === teamCard?.isPremier &&
            tc?.id !== teamCard?.id &&
            !teams[tc.id]
        ))
    );

    const foundGames: IGame[] = [];
    Object.keys(teams).forEach(teamId => {
      const hostTeam = this.teamCards[teamId];
      const team = teams[teamId];

      if (!hostTeam || !team) return;

      const teamGames = this.updatedGames.filter(
        ({ awayTeam, homeTeam }) =>
          awayTeam?.id === hostTeam.id ||
          homeTeam?.id === hostTeam.id ||
          awayTeam?.id === team?.id ||
          homeTeam?.id === team?.id
      );

      let teamsTimeSlotIds = teamGames.map(game => game.timeSlotId);
      teamsTimeSlotIds.forEach(timeSlotId =>
        teamsTimeSlotIds.push(timeSlotId + 1, timeSlotId - 1)
      );
      teamsTimeSlotIds = union(teamsTimeSlotIds).filter(id => id >= 0);

      const foundGame = this.updatedGames.find(
        game =>
          game.isPremier === hostTeam.isPremier &&
          !game.awayTeam &&
          !game.homeTeam &&
          !teamsTimeSlotIds.includes(game.timeSlotId) &&
          this.facilityData[game.facilityId!].divisionIds?.includes(
            hostTeam.divisionId
          ) &&
          this.facilityData[game.facilityId!].divisionIds?.includes(
            team.divisionId
          )
      );

      if (foundGame) {
        foundGames.push(foundGame);
        [hostTeam, team].forEach(t => {
          const foundUpdatedGame = this.updatedGames.find(
            game => game.id === foundGame.id
          );
          if (!foundUpdatedGame) return;

          const updatedTeam = this.updateTeam(t, foundUpdatedGame!);
          this.setTeamInPlay(t, foundGame);
          this.updateGame(foundGame, updatedTeam);
        });
      }
    });
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
    return this.facilityData[facilityId!]?.divisionIds;
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

    const teamsInDivisions = {};
    this.teamCards.forEach(
      teamCard =>
        (teamsInDivisions[teamCard.divisionId] =
          teamsInDivisions[teamCard.divisionId] + 1 || 1)
    );

    const sortedFacilities = getSortedByGamesNum(this.facilityData);
    const sortedDivisions = getSortedDesc(teamsInDivisions);

    const numberOfAllTeams = this.teamCards.filter(
      teamCard => !teamCard.isPremier
    ).length;

    // If all teams can fit in one biggest facility then let it be
    if (numberOfAllTeams <= this.facilityData[sortedFacilities[0]]?.gamesNum!) {
      this.facilityData[sortedFacilities[0]] = {
        ...this.facilityData[sortedFacilities[0]],
        divisionIds: [...sortedDivisions.map(Number)],
      };
      return;
    }

    // Put divisions in facilities by number of games and teams
    sortedDivisions.forEach((divisionId, index) => {
      const facilityId = sortedFacilities[index] || sortedFacilities[0];
      this.facilityData[facilityId] = {
        ...this.facilityData[facilityId],
        divisionIds: [
          ...(this.facilityData[facilityId]?.divisionIds || []),
          Number(divisionId),
        ],
      };
    });
  };

  calculateAvgStartTime = () => {
    const timeStarts = this.teamCards.map(tc => tc.startTime);
    this.avgStartTime = arrayAverageOccurrence(timeStarts);
  };

  calculateEmptyFields = () => {
    const fields = this.updatedGames
      .filter(game => game.awayTeam && game.homeTeam)
      .map(game => game.fieldId);

    const fieldsUnique = union(fields);
    this.unusedFields = this.fields
      .map(field => field.id)
      .filter(fieldId => !fieldsUnique.includes(fieldId));

    this.fields = this.fields.map(field => ({
      ...field,
      isUnused: this.unusedFields?.includes(field.id),
    }));
  };
}

/*

  ✓ Premier teams can only play on Premier fields
  ✓ Teams from One Division can only play on One Facility
  ✓ Teams can only play one game for one TimeSlot
  ✓ Teams can only play after defined start time
  ✓ Teams cannot play back-to-back games
  ✓ Min Max Games Guarantee
  ✓ Handle single teams game picking
  ✓ Handle pool constrains

*/
