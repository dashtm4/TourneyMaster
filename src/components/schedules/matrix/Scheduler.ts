import { union, findKey } from 'lodash-es';
import { getTimeFromString } from 'helpers/stringTimeOperations';
import { ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import {
  IGame,
  TeamPositionEnum,
  arrayAverageOccurrence,
  getSortedByGamesNum,
  getSortedDesc,
} from './helper';
import { ITimeSlot } from '..';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IScheduleDivision } from 'common/models/schedule/divisions';

export interface IGameOptions {
  minGameNum?: number;
  maxGameNum?: number;
  totalGameTime?: number;
}

interface IConditions {
  isPremier?: boolean;
}

interface IKeyId {
  [key: string]: (string | undefined)[];
}

interface IUnequippedTeams {
  [key: string]: ITeamCard | undefined;
}

interface IFacilityData {
  [key: string]: {
    divisionIds?: string[];
    gamesPerTeam?: number;
    gamesNum?: number;
  };
}

interface ITournamentBaseInfo {
  facilities: IScheduleFacility[];
  divisions: IScheduleDivision[];
  gameOptions: IGameOptions;
}

export default class Scheduler {
  fields: IField[];
  teamCards: ITeamCard[];
  games: IGame[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  divisions: IScheduleDivision[];
  updatedGames: IGame[];
  teamsInPlay: IKeyId;
  facilityData: IFacilityData;
  avgStartTime?: string;
  teamGameNum?: number;
  unusedFields?: string[];
  poolsData: IKeyId;
  minGameNum = 3;
  maxGameNum = 5;
  totalGameTime: number;

  constructor(
    fields: IField[],
    teamCards: ITeamCard[],
    games: IGame[],
    timeSlots: ITimeSlot[],
    tournamentBaseInfo: ITournamentBaseInfo
  ) {
    const { facilities, divisions, gameOptions } = tournamentBaseInfo || {};

    this.fields = fields;
    this.teamCards = teamCards;
    this.games = games;
    this.timeSlots = timeSlots;
    this.facilities = facilities;
    this.divisions = divisions;
    this.updatedGames = [];
    this.teamsInPlay = {};
    this.facilityData = {};
    this.poolsData = {};

    this.minGameNum = gameOptions?.minGameNum || 3;
    this.maxGameNum = gameOptions?.maxGameNum || 5;
    this.totalGameTime = gameOptions?.totalGameTime || 0;

    this.calculateTeamGameNum();
    this.setTeamsPerPools();
    this.calculateGamesForFacilities();
    this.calculateAvgStartTime();
    this.populateGameData();
    this.calculateTeamData();
    // this.handleUnequippedTeams();
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
    const teamSets: IUnequippedTeams = this.rearrangeTeamsByConstraints();
    this.manageGamesByTeamSets(teamSets);
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

  rearrangeTeamsByConstraints = () => {
    const teams = {};
    this.teamCards.forEach(teamCard => {
      teams[teamCard.id] = this.teamCards.find(
        tc =>
          teamCard.id !== tc.id &&
          teamCard.isPremier === tc.isPremier &&
          teamCard.poolId &&
          tc.poolId &&
          teamCard.poolId === tc.poolId &&
          !Object.keys(teams).find(key => key === teamCard.id) &&
          !Object.keys(teams).find(key => key === tc.id) &&
          !Object.keys(teams).find(key => teams[key]?.id === teamCard.id) &&
          !this.teamsInPlay[teamCard.id]?.includes(tc.id) &&
          !this.teamsInPlay[tc.id]?.includes(teamCard.id)
      );
    });
    return teams;
  };

  manageGamesByTeamSets = (teamSets: IUnequippedTeams) => {
    const foundGames: IGame[] = [];
    Object.keys(teamSets).map(key => {
      const teamOne = teamSets[key];
      const teamTwo = this.teamCards.find(tc => tc.id === key);

      if (!teamOne || !teamTwo) return;

      const foundGame = this.findGame(teamOne, teamTwo);

      if (foundGame) {
        foundGames.push(foundGame);
        [teamOne, teamTwo].map(team => {
          const foundUpdatedGame = this.updatedGames.find(
            game => game.id === foundGame.id
          );

          if (!foundUpdatedGame) return;

          const updatedTeam = this.updateTeam(team, foundUpdatedGame!);
          this.updateFacilityData(team, foundUpdatedGame);
          this.saveUpdatedTeam(updatedTeam);
          this.setTeamInPlay(team, foundUpdatedGame);
          this.updateGame(foundUpdatedGame, updatedTeam);
        });
      }
    });
    return foundGames;
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

  findGame = (
    teamOne: ITeamCard,
    teamTwo: ITeamCard,
    _conditions?: IConditions
  ) => {
    const teamGames = this.updatedGames.filter(
      ({ awayTeam, homeTeam }) =>
        awayTeam?.id === teamOne.id ||
        homeTeam?.id === teamOne.id ||
        awayTeam?.id === teamTwo?.id ||
        homeTeam?.id === teamTwo?.id
    );

    let teamsTimeSlotIds = teamGames.map(game => game.timeSlotId);
    teamsTimeSlotIds.forEach(timeSlotId =>
      teamsTimeSlotIds.push(timeSlotId, timeSlotId + 1, timeSlotId - 1)
    );
    teamsTimeSlotIds = union(teamsTimeSlotIds).filter(id => id >= 0);

    return this.updatedGames.find(
      game =>
        game.isPremier === teamOne.isPremier &&
        !game.awayTeam &&
        !game.homeTeam &&
        !teamsTimeSlotIds.includes(game.timeSlotId) &&
        this.checkForFacilityConsistency(teamOne, game)
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
    this.teamGameNum = Math.round(timeSlotsNum / 2);
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

  updateFacilityData = (teamCard: ITeamCard, game: IGame) => {
    const facilityId = game.facilityId || 'default';
    const divisionId = teamCard.divisionId;
    const divisionIdsArr = this.facilityData[facilityId]?.divisionIds;

    const facilityDataIncludesDivision = findKey(this.facilityData, data =>
      data.divisionIds?.includes(divisionId)
    );

    if (!facilityDataIncludesDivision)
      this.facilityData = {
        ...this.facilityData,
        [facilityId]: {
          ...(this.facilityData[facilityId] || []),
          divisionIds: [...(divisionIdsArr || []), divisionId],
        },
      };
  };

  checkForFacilityConsistency = (teamCard: ITeamCard, game: IGame) => {
    const facilityDivisions = this.facilityData[game.facilityId!]?.divisionIds;
    let result = false;

    if (teamCard.isPremier) {
      const facilityWithThisDivision = findKey(this.facilityData, data =>
        data.divisionIds?.includes(teamCard.divisionId)
      );
      if (facilityWithThisDivision !== undefined) {
        result = Boolean(facilityWithThisDivision === game.facilityId);
      } else {
        result = true;
      }
    } else {
      result = Boolean(facilityDivisions?.includes(teamCard.divisionId));
    }

    return result;
  };

  // handleUnequippedTeams = () => {
  //   const minGameGuaranteeTeams = this.teamCards.filter(
  //     teamCard => (teamCard.games?.length || 0) < this.minGameNum
  //   );

  //   const unequippedTeamCards: (ITeamCard | undefined)[] = [
  //     ...minGameGuaranteeTeams,
  //   ];

  //   this.updatedGames = this.updatedGames.map(game => {
  //     const { awayTeam, homeTeam } = game;
  //     if (!(awayTeam && homeTeam) && (awayTeam || homeTeam)) {
  //       unequippedTeamCards.push(awayTeam || homeTeam);
  //       delete game.awayTeam;
  //       delete game.homeTeam;
  //     }
  //     return game;
  //   });

  //   const unequippedTeams: IUnequippedTeams = {};
  //   unequippedTeamCards.forEach(
  //     teamCard =>
  //       (unequippedTeams[teamCard?.id!] = unequippedTeamCards.find(
  //         team =>
  //           !this.teamsInPlay[team?.id!]?.includes(teamCard?.id!) &&
  //           !this.teamsInPlay[teamCard?.id!]?.includes(team?.id!) &&
  //           teamCard?.poolId === team?.poolId &&
  //           team?.isPremier === teamCard?.isPremier &&
  //           team?.id !== teamCard?.id &&
  //           !unequippedTeams[team?.id!]
  //       ))
  //   );

  //   this.resolveUnequippedTeamGames(unequippedTeams);
  // };

  // resolveUnequippedTeamGames = (teams: IUnequippedTeams) => {
  //   const foundGames: IGame[] = [];
  //   Object.keys(teams).forEach(teamId => {
  //     const hostTeam = this.teamCards.find(tc => tc.id === teamId);
  //     const team = teams[teamId];

  //     if (!hostTeam || !team) return;

  //     const teamGames = this.updatedGames.filter(
  //       ({ awayTeam, homeTeam }) =>
  //         awayTeam?.id === hostTeam.id ||
  //         homeTeam?.id === hostTeam.id ||
  //         awayTeam?.id === team?.id ||
  //         homeTeam?.id === team?.id
  //     );

  //     let teamsTimeSlotIds = teamGames.map(game => game.timeSlotId);
  //     teamsTimeSlotIds.forEach(timeSlotId =>
  //       teamsTimeSlotIds.push(timeSlotId, timeSlotId + 1, timeSlotId - 1)
  //     );
  //     teamsTimeSlotIds = union(teamsTimeSlotIds).filter(id => id >= 0);

  //     const foundGame = this.updatedGames.find(
  //       game =>
  //         game.isPremier === hostTeam.isPremier &&
  //         !game.awayTeam &&
  //         !game.homeTeam &&
  //         !teamsTimeSlotIds.includes(game.timeSlotId) &&
  //         this.facilityData[game.facilityId!].divisionIds?.includes(
  //           hostTeam.divisionId
  //         ) &&
  //         this.facilityData[game.facilityId!].divisionIds?.includes(
  //           team.divisionId
  //         )
  //     );

  //     if (foundGame) {
  //       foundGames.push(foundGame);
  //       [hostTeam, team].forEach(t => {
  //         const foundUpdatedGame = this.updatedGames.find(
  //           game => game.id === foundGame.id
  //         );
  //         if (!foundUpdatedGame) return;

  //         const updatedTeam = this.updateTeam(t, foundUpdatedGame!);
  //         this.saveUpdatedTeam(updatedTeam);
  //         this.setTeamInPlay(t, foundGame);
  //         this.updateGame(foundGame, updatedTeam);
  //       });
  //     }
  //   });
  // };

  updateTeam = (teamCard: ITeamCard, game: IGame) => {
    return {
      ...teamCard,
      games: union([...(teamCard.games || []), game.id]),
      fieldId: game.fieldId,
      timeSlotId: game.timeSlotId,
      teamPosition: game.awayTeam
        ? TeamPositionEnum.homeTeam
        : TeamPositionEnum.awayTeam,
    };
  };

  saveUpdatedTeam = (updatedTeamCard: ITeamCard) => {
    this.teamCards = this.teamCards.map(teamCard =>
      teamCard.id === updatedTeamCard.id ? updatedTeamCard : teamCard
    );
  };

  gameStartsInProperTime = (game: IGame, teamCard: ITeamCard) => {
    const gameTime = getTimeFromString(game.startTime!, 'minutes');
    const teamTime = getTimeFromString(teamCard.startTime, 'minutes');
    return gameTime >= teamTime;
  };

  teamInPlayGames = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam, homeTeam } = game;
    const id = awayTeam?.id !== undefined ? awayTeam.id : homeTeam?.id;
    return (
      this.teamsInPlay[teamCard.id]?.includes(id) ||
      this.teamsInPlay[id!]?.includes(teamCard.id)
    );
  };

  setTeamInPlay = (teamCard: ITeamCard, game: IGame) => {
    const { awayTeam, homeTeam } = game;
    const newTeamId = [
      awayTeam?.id !== undefined ? awayTeam.id : homeTeam?.id,
    ].filter(el => el !== undefined);

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
    const facilities: string[] = [];
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
        !teamCard.isPremier &&
        (teamsInDivisions[teamCard.divisionId] =
          teamsInDivisions[teamCard.divisionId] + 1 || 1)
    );

    const sortedFacilities = getSortedByGamesNum(this.facilityData);
    const sortedDivisions = getSortedDesc(teamsInDivisions);

    const numberOfAllTeams = this.teamCards.filter(
      teamCard => !teamCard.isPremier
    ).length;

    // If all teams can fit in one biggest facility then let it be
    if (
      numberOfAllTeams * this.minGameNum <=
      this.facilityData[sortedFacilities[0]]?.gamesNum!
    ) {
      this.facilityData[sortedFacilities[0]] = {
        ...this.facilityData[sortedFacilities[0]],
        divisionIds: [...sortedDivisions],
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
          divisionId,
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
