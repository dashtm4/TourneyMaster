import { union, findKey, find, keys, orderBy } from 'lodash-es';
import { getTimeFromString } from 'helpers';
import { ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import {
  IGame,
  TeamPositionEnum,
  arrayAverageOccurrence,
  getSortedByGamesNum,
  getSortedDesc,
} from 'components/common/matrix-table/helper';
import { ITimeSlot } from './index';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IScheduleDivision } from 'common/models/schedule/divisions';

export interface IGameOptions {
  minGameNum?: number;
  maxGameNum?: number;
  totalGameTime?: number;
}

interface IFindGameOptions {
  ignorePremier?: boolean;
  includeBackToBack?: boolean;
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
  minGameNum: number;
  maxGameNum: number;
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
    this.handleMinGameMinimum();
    this.calculateEmptyFields();
  }

  populateGameData = () => {
    this.updatedGames = [...this.games].map(game => ({
      ...game,
      isPremier: !!find(this.fields, { id: game.fieldId, isPremier: true }),
      startTime: find(this.timeSlots, { id: game.timeSlotId })?.time,
      facilityId: find(this.fields, { id: game.fieldId })?.facilityId,
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

  rearrangeTeamsByConstraints = (teamCards?: ITeamCard[]) => {
    const teamCardsArr = teamCards || this.teamCards;
    const teams = {};
    teamCardsArr.forEach(teamCard => {
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

  manageGamesByTeamSets = (
    teamSets: IUnequippedTeams,
    options?: IFindGameOptions
  ) => {
    const foundGames: IGame[] = [];
    keys(teamSets).map(key => {
      const teamOne = teamSets[key];
      const teamTwo = this.teamCards.find(tc => tc.id === key);

      if (!teamOne || !teamTwo) return;

      const foundGame = this.findGame(teamOne, teamTwo, options);

      if (foundGame) {
        foundGames.push(foundGame);

        [teamOne, teamTwo].map(team => {
          const foundUpdatedGame = this.updatedGames.find(
            game => game.id === foundGame.id
          );
          if (!foundUpdatedGame) return;
          const updatedTeam = this.updateTeam(team, foundUpdatedGame);
          this.updateFacilityData(team, foundUpdatedGame);
          this.saveUpdatedTeam(updatedTeam);
          this.updateGame(foundUpdatedGame, updatedTeam);
        });

        this.setTeamInPlay(teamOne, teamTwo);
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
    options?: IFindGameOptions
  ) => {
    const { ignorePremier, includeBackToBack } = options || {};
    const teamGames = this.updatedGames.filter(
      ({ awayTeam, homeTeam }) =>
        awayTeam?.id === teamOne.id ||
        homeTeam?.id === teamOne.id ||
        awayTeam?.id === teamTwo?.id ||
        homeTeam?.id === teamTwo?.id
    );

    return this.updatedGames.find(
      game =>
        (ignorePremier || game.isPremier === teamOne.isPremier) &&
        !game.awayTeam &&
        !game.homeTeam &&
        this.checkTimeSlotsConsistency(
          teamGames,
          game.timeSlotId,
          includeBackToBack
        ) &&
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

  checkTimeSlotsConsistency = (
    teamGames: IGame[],
    gameTimeSlotId: number,
    includeBackToBack?: boolean
  ) => {
    const backToBackTimeSlots = teamGames.map(game => game.timeSlotId);
    let regularTimeSlots: number[] = [];

    backToBackTimeSlots.forEach(
      timeSlotId =>
        (regularTimeSlots = [
          ...(regularTimeSlots || []),
          timeSlotId,
          timeSlotId - 1,
          timeSlotId + 1,
        ])
    );
    regularTimeSlots = union(regularTimeSlots).filter(id => id >= 0);

    const timeSlots = includeBackToBack
      ? backToBackTimeSlots
      : regularTimeSlots;

    return !timeSlots.includes(gameTimeSlotId);
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

  updateTeam = (teamCard: ITeamCard, game: IGame) => {
    const games = teamCard.games || [];
    games.push(game.id);

    const teamPosition = game.awayTeam
      ? TeamPositionEnum.homeTeam
      : TeamPositionEnum.awayTeam;

    return {
      ...teamCard,
      games,
      teamPosition,
      fieldId: game.fieldId,
      timeSlotId: game.timeSlotId,
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

  setTeamInPlay = (teamOne: ITeamCard, teamTwo: ITeamCard) => {
    const teamsPlayOne = this.teamsInPlay[teamOne.id];
    const teamsPlayTwo = this.teamsInPlay[teamTwo.id];

    this.teamsInPlay = {
      ...this.teamsInPlay,
      [teamOne.id]: union([...(teamsPlayOne || []), teamTwo.id]),
      [teamTwo.id]: union([...(teamsPlayTwo || []), teamOne.id]),
    };
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

  getUnsatisfiedTeams = (options?: { isPremier?: boolean }) => {
    const { isPremier } = options || {};

    return this.teamCards.filter(teamCard => {
      if (!teamCard.poolId) return false;

      if (!(teamCard.games?.length! < this.minGameNum)) return false;

      if (isPremier !== undefined) {
        if (teamCard.isPremier !== isPremier) {
          return false;
        }
      }

      return true;
    });
  };

  settleMinGameTeams = (teams: ITeamCard[], options?: IFindGameOptions) => {
    const rearrangedTeams = this.rearrangeTeamsByConstraints(teams);
    const foundGames = this.manageGamesByTeamSets(rearrangedTeams, options);
    return foundGames;
  };

  handleMinGameMinimum = () => {
    const myFunction = (
      isPremier: boolean,
      gameOptions: IFindGameOptions,
      recursor: number = 0
    ) => {
      const unsatisfiedTeams = this.getUnsatisfiedTeams({ isPremier });
      const sortedTeams = orderBy(unsatisfiedTeams, 'games.length');
      const divideBy =
        recursor === 0 ? sortedTeams[0]?.games?.length : this.maxGameNum;
      recursor++;

      const teams = sortedTeams.filter(
        team => team.games?.length! <= divideBy!
      );

      this.settleMinGameTeams(teams, gameOptions);

      const unsatisfiedTeamsLeft = this.getUnsatisfiedTeams({ isPremier });
      const sortedTeamsLeft = orderBy(unsatisfiedTeamsLeft, 'games.length');

      if (sortedTeamsLeft.length && recursor <= this.minGameNum) {
        myFunction(isPremier, gameOptions, recursor);
      }
    };

    // premier teams --> premier fields (back-to-back)
    myFunction(true, { includeBackToBack: true });
    // premier teams --> regular fields (w/o back-to-back)
    myFunction(true, { ignorePremier: true });
    // premier teams --> regular fields (back-to-back)
    myFunction(true, { includeBackToBack: true, ignorePremier: true });

    // regular teams (back-to-back)
    myFunction(false, { includeBackToBack: true });
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
