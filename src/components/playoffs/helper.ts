import { orderBy, union, min, max, groupBy, maxBy, minBy } from 'lodash-es';
import { IGame } from 'components/common/matrix-table/helper';
import { IBracketGame } from './bracketGames';
import { IOnAddGame } from './add-game-modal';
import { getVarcharEight } from 'helpers';
import { IDivision, IField, ISchedulesDetails } from 'common/models';
import { ITeamCard } from 'common/models/schedule/teams';
import { MovePlayoffWindowEnum } from '.';
import ITimeSlot from 'common/models/schedule/timeSlots';

interface IBracketMoveWarning {
  gameAlreadyAssigned: boolean;
  gamePlayTimeInvalid: boolean;
  facilitiesDiffer: boolean;
}

export const updateGameBracketInfo = (game: IGame, withGame?: IGame) => ({
  ...game,
  awaySeedId: withGame?.awaySeedId,
  homeSeedId: withGame?.homeSeedId,
  awayDisplayName: withGame?.awayDisplayName,
  homeDisplayName: withGame?.homeDisplayName,
  awayTeam: withGame?.awayTeam,
  homeTeam: withGame?.homeTeam,
  divisionId: withGame?.divisionId,
  divisionName: withGame?.divisionName,
  divisionHex: withGame?.divisionHex,
  playoffIndex: withGame?.playoffIndex,
});

export const advanceTeamsIntoAnotherBracket = (
  bracketGame: IBracketGame,
  bracketGames: IBracketGame[]
) => {
  const whoIsWinner =
    (bracketGame.homeTeamScore || 0) > (bracketGame.awayTeamScore || 0)
      ? bracketGame.homeTeamId
      : bracketGame.awayTeamId;

  const whoIsLoser =
    (bracketGame.homeTeamScore || 0) < (bracketGame.awayTeamScore || 0)
      ? bracketGame.homeTeamId
      : bracketGame.awayTeamId;

  const newBracketGames = bracketGames.map(item => {
    if (
      item.divisionId === bracketGame.divisionId &&
      (item.awayDependsUpon === bracketGame.index ||
        item.homeDependsUpon === bracketGame.index)
    ) {
      const isAwayTeam = item.awayDependsUpon === bracketGame.index;
      const positionedTeam = isAwayTeam ? 'awayTeamId' : 'homeTeamId';

      return {
        ...item,
        [positionedTeam]: item.round >= 0 ? whoIsWinner : whoIsLoser,
      };
    }

    if (item.id === bracketGame.id) return bracketGame;

    return item;
  });

  return newBracketGames;
};

export const advanceTeamsFromBrackets = (
  bracketGame: IBracketGame,
  bracketGames: IBracketGame[]
) => {
  const divisionGames = bracketGames.filter(
    item => item.divisionId === bracketGame.divisionId
  );
  const awayBracketGame = divisionGames.find(
    item => item.index === bracketGame.awayDependsUpon
  );
  const homeBracketGame = divisionGames.find(
    item => item.index === bracketGame.homeDependsUpon
  );

  const findTeamId = (bracket: IBracketGame, isWinner: boolean) => {
    if (!bracket.awayTeamScore || !bracket.homeTeamScore) return null;
    if ((bracket.awayTeamScore || 0) > (bracket.homeTeamScore || 0)) {
      return isWinner ? bracket.awayTeamId : bracket.homeTeamId;
    } else {
      return isWinner ? bracket.homeTeamId : bracket.awayTeamId;
    }
  };

  const awayWinner = awayBracketGame ? findTeamId(awayBracketGame, true) : null;
  const awayLoser = awayBracketGame ? findTeamId(awayBracketGame, false) : null;
  const homeWinner = homeBracketGame ? findTeamId(homeBracketGame, true) : null;
  const homeLoser = homeBracketGame ? findTeamId(homeBracketGame, false) : null;

  const awayTeamId = bracketGame.round > 0 ? awayWinner : awayLoser;
  const homeTeamId = bracketGame.round > 0 ? homeWinner : homeLoser;

  return {
    ...bracketGame,
    awayTeamId,
    homeTeamId,
  } as IBracketGame;
};

export const addGameToExistingBracketGames = (
  data: IOnAddGame,
  bracketGames: IBracketGame[],
  divisionId: string
) => {
  const { isWinner } = data;
  const awayDependsUpon = Number(data.awayDependsUpon);
  const homeDependsUpon = Number(data.homeDependsUpon);
  let gridNum = data.gridNum;

  // Selected division games
  const divisionGames = bracketGames?.filter(v => v.divisionId === divisionId);

  // Get origin games
  let awayDependent = bracketGames.find(v => v.index === awayDependsUpon)!;
  let homeDependent = bracketGames.find(v => v.index === homeDependsUpon)!;

  const bothOriginAreNotFromMainGrid =
    awayDependent.gridNum !== 1 && homeDependent.gridNum !== 1;

  // Set round for the new game
  let round = 0;
  const roundInceremented =
    Math.max(Math.abs(awayDependent?.round), Math.abs(homeDependent?.round)) +
    1;
  round = isWinner ? roundInceremented : -roundInceremented;

  // Create a new grid or merge existing
  if (bothOriginAreNotFromMainGrid) {
    gridNum = Math.min(awayDependent?.gridNum, homeDependent?.gridNum);
    const dependentRoundMax = Math.max(
      Math.abs(awayDependent.round),
      Math.abs(homeDependent.round)
    );
    const dependentRound =
      awayDependent.round < 0 ? -dependentRoundMax : dependentRoundMax;
    awayDependent = {
      ...awayDependent,
      round: dependentRound,
      gridNum,
    };
    homeDependent = {
      ...homeDependent,
      round: dependentRound,
      gridNum,
    };
  }

  const newBracketGame: IBracketGame = {
    id: getVarcharEight(),
    index: divisionGames.length + 1,
    round,
    gridNum,
    divisionId,
    divisionName: divisionGames[0].divisionName,
    awaySeedId: undefined,
    homeSeedId: undefined,
    awayTeamId: undefined,
    homeTeamId: undefined,
    awayDisplayName: 'Away',
    homeDisplayName: 'Home',
    awayDependsUpon,
    homeDependsUpon,
    fieldId: undefined,
    fieldName: undefined,
    startTime: undefined,
    gameDate: divisionGames[0].gameDate,
    hidden: false,
    isCancelled: false,
    createDate: new Date().toISOString(),
  };

  const newBracketGames = bracketGames.map(item => {
    if (item.id === awayDependent.id) return awayDependent;
    if (item.id === homeDependent.id) return homeDependent;
    return item;
  });

  const newAdvancedBracketGame = advanceTeamsFromBrackets(
    newBracketGame,
    newBracketGames
  );

  newBracketGames.push(newAdvancedBracketGame);

  return newBracketGames;
};

/* Get games indices that depend upon the given BracketGame */
export const getDependentGames = (
  dependentInds: number[],
  games: IBracketGame[]
): number[] => {
  const foundGames = games.filter(
    item =>
      dependentInds.includes(item.awayDependsUpon!) ||
      dependentInds.includes(item.homeDependsUpon!)
  );

  const foundGamesInds = foundGames.map(item => item.index);
  const newDependentInds = [...dependentInds, ...foundGamesInds];

  const newGames = games.filter(item => !foundGamesInds.includes(item.index));

  if (!foundGamesInds?.length || !newGames?.length) {
    return union(newDependentInds);
  }

  return getDependentGames(newDependentInds, newGames);
};

/* Get games indices that the given BracketGame depends on */
const getGameDependsUpon = (
  dependentInds: number[],
  games: IBracketGame[]
): number[] => {
  const myGamesDependsUpon = games
    .filter(item => dependentInds.includes(item.index))
    .map(item => [item.awayDependsUpon, item.homeDependsUpon])
    .flat();

  const newDependentInds: number[] = [
    ...dependentInds,
    ...myGamesDependsUpon,
  ].filter(v => v) as number[];

  const newGames = games.filter(item => !dependentInds.includes(item.index));

  if (!myGamesDependsUpon.filter(v => v).length || !newGames.length) {
    return union(newDependentInds);
  }

  return getGameDependsUpon(newDependentInds, newGames);
};

export const removeGameFromBracketGames = (
  gameIndex: number,
  games: IBracketGame[],
  divisionId: string
) => {
  const dependentInds = [gameIndex];
  const divisionGames = games.filter(item => item.divisionId === divisionId);

  const newFound = getDependentGames(dependentInds, divisionGames);

  const removedGames = games
    .filter(
      item => item.divisionId === divisionId && newFound.includes(item.index)
    )
    .map(item => ({ ...item, hidden: true }));

  const updatedDivisionGames = games
    .filter(
      item => item.divisionId === divisionId && !newFound.includes(item.index)
    )
    .map((item, index) => ({ ...item, index: index + 1 }));

  const otherGames = games.filter(item => item.divisionId !== divisionId);

  const allGames = orderBy(
    [...otherGames, ...updatedDivisionGames],
    'divisionId'
  );

  const resultGames: IBracketGame[] = [...allGames, ...removedGames];
  return resultGames;
};

export const updateGameSlot = (
  game: IGame,
  bracketGame?: IBracketGame,
  divisions?: IDivision[]
): IGame => {
  const division = divisions?.find(
    v => v.division_id === bracketGame?.divisionId
  );

  return {
    ...game,
    bracketGameId: bracketGame?.id,
    awaySeedId: bracketGame?.awaySeedId,
    homeSeedId: bracketGame?.homeSeedId,
    awayTeamId: bracketGame?.awayTeamId,
    homeTeamId: bracketGame?.homeTeamId,
    awayDisplayName: bracketGame?.awayDisplayName,
    homeDisplayName: bracketGame?.homeDisplayName,
    awayDependsUpon: bracketGame?.awayDependsUpon,
    homeDependsUpon: bracketGame?.homeDependsUpon,
    divisionId: bracketGame?.divisionId,
    divisionName: bracketGame?.divisionName,
    divisionHex: division?.division_hex,
    playoffRound: bracketGame?.round,
    playoffIndex: bracketGame?.index,
    awayTeamScore: bracketGame?.awayTeamScore,
    homeTeamScore: bracketGame?.homeTeamScore,
    isCancelled: bracketGame?.isCancelled,
  };
};

enum BracketMoveWarnEnum {
  gameAlreadyAssigned = 'This bracket game is already assigned. Please confirm your intentions.',
  gamePlayTimeInvalid = 'This bracket game depends upon preceeding games being complete. They are not. Please place this game in a later game slot.',
  facilitiesDiffer = 'This division is not playing at this facility on this day. Please confirm your intentions.',
}

export const setReplacementMessage = (
  bracketGames: IBracketGame[],
  warnings: IBracketMoveWarning
): {
  bracketGames?: IBracketGame[];
  message?: string;
} | null => {
  switch (true) {
    case warnings.gamePlayTimeInvalid:
      return {
        message: BracketMoveWarnEnum.gamePlayTimeInvalid,
      };
    case warnings.facilitiesDiffer:
      return {
        bracketGames,
        message: BracketMoveWarnEnum.facilitiesDiffer,
      };
    case warnings.gameAlreadyAssigned:
      return {
        bracketGames,
        message: BracketMoveWarnEnum.gameAlreadyAssigned,
      };
    default:
      return null;
  }
};

export const updateBracketGame = (
  bracketGame: IBracketGame,
  gameSlot?: IGame,
  fieldName?: string
) => ({
  ...bracketGame,
  fieldId: gameSlot?.fieldId,
  fieldName: fieldName || 'Empty',
  startTime: gameSlot?.startTime,
  gameDate: gameSlot?.gameDate,
});

export const updateBracketGamesDndResult = (
  gameId: string,
  slotId: number,
  bracketGames: IBracketGame[],
  games: IGame[],
  fields: IField[],
  originId?: number,
  teamCards?: ITeamCard[]
) => {
  const playoffsGameDate = games.map(v => v.gameDate).filter(v => v)[0];

  const warnings: IBracketMoveWarning = {
    gameAlreadyAssigned: false,
    gamePlayTimeInvalid: false,
    facilitiesDiffer: false,
  };
  /* 1. Find a bracket game that is being dragged */
  const bracketGame = bracketGames.find(item => item.id === gameId);
  /* 2. Find a game slot where the bracket game is gonna be placed */
  const gameSlot = games.find(item => item.id === slotId);
  /* 3. Check if the bracket game is not placed anywhere else */
  /*  3.1. If so - return a warning popup */
  /* 4. Populate the bracket data with the game slot data */
  const fieldName = fields.find(item => item.field_id === gameSlot?.fieldId)
    ?.field_name;

  bracketGames = bracketGames.map(item =>
    /* First - unassign existing bracket game */
    /* Then - assign our bracket game to that place */
    item.fieldId === gameSlot?.fieldId && item.startTime === gameSlot?.startTime
      ? updateBracketGame(item)
      : item.id === bracketGame?.id
      ? updateBracketGame(item, gameSlot, fieldName)
      : item
  );

  /* WARNINGS SETUP */
  /* Check assignment for the given BracketGame */
  const bracketGameToUpdate = bracketGames.find(
    item => item.id === bracketGame?.id
  );

  warnings.gameAlreadyAssigned = Boolean(
    originId === -1 &&
      bracketGame?.fieldId &&
      bracketGame?.startTime &&
      bracketGameToUpdate?.fieldId &&
      bracketGameToUpdate.startTime
  );

  /* Check play time for the given BracketGame */
  const divisionGames = [...bracketGames].filter(
    item => item.divisionId === bracketGame?.divisionId
  );

  const dependentInds = getDependentGames(
    [bracketGame?.index || -1],
    divisionGames
  );

  const gameDependsUpon = getGameDependsUpon(
    [bracketGame?.index || -1],
    divisionGames
  );

  const nextDependentStartTimes = divisionGames
    .filter(item => item.index !== bracketGame?.index)
    .filter(item => dependentInds.includes(item.index))
    .map(item => item.startTime);

  const previousDependentStartTimes = divisionGames
    .filter(item => item.index !== bracketGame?.index)
    .filter(item => gameDependsUpon.includes(item.index))
    .map(item => item.startTime);

  const minStartTimeAvailable = min(nextDependentStartTimes);
  const maxStartTimeAvailable = max(previousDependentStartTimes);

  const bracketNewTime = divisionGames.find(
    item => item.index === bracketGame?.index
  )?.startTime;

  warnings.gamePlayTimeInvalid =
    !!bracketNewTime &&
    (!!(minStartTimeAvailable && bracketNewTime >= minStartTimeAvailable) ||
      !!(maxStartTimeAvailable && bracketNewTime <= maxStartTimeAvailable));

  /* Check for Facilities consistency for the given BracketGame */
  const divisionGamesFacilitiesIds = games
    .filter(item => divisionGames.some(dg => dg.id === item.bracketGameId))
    .map(item => item.facilityId);

  const divisionGameIds = teamCards
    ?.filter(item => item.divisionId === bracketGame?.divisionId)
    .map(item =>
      item.games?.filter(v => v.date === playoffsGameDate)?.map(v => v.id)
    )
    .flat();

  const tableGames = games
    .filter(item => item.gameDate === playoffsGameDate)
    .filter(item => divisionGameIds?.includes(item.id));

  const facilitiesIds = Object.keys(groupBy(tableGames, 'facilityId')).map(
    key => key
  );

  const bracketGamesFacilitiesUnmatch =
    gameSlot?.facilityId &&
    !divisionGamesFacilitiesIds.includes(gameSlot?.facilityId);

  const regularGamesFacilitiesUnmatch =
    divisionGamesFacilitiesIds.length === 0
      ? gameSlot?.facilityId &&
        facilitiesIds.length > 0 &&
        !facilitiesIds.includes(gameSlot?.facilityId)
      : bracketGamesFacilitiesUnmatch;

  warnings.facilitiesDiffer = Boolean(
    bracketGamesFacilitiesUnmatch && regularGamesFacilitiesUnmatch
  );

  return { bracketGames, warnings };
};

const getMinMaxGameTimeSlots = (
  schedulesDetails: ISchedulesDetails[],
  timeSlots: ITimeSlot[],
  day: string
) => {
  const lastGame = maxBy(
    schedulesDetails.filter(
      item => item.game_date === day && (item.away_team_id || item.home_team_id)
    ),
    'game_time'
  );

  const lastGameTimeSlotId =
    timeSlots.find(item => item.time === lastGame?.game_time)?.id || 0;
  const minGameTimeSlotAvailable =
    timeSlots.length > lastGameTimeSlotId ? lastGameTimeSlotId + 1 : 0;
  const maxGameTimeSlotAvailable = timeSlots.length - 1;

  return { minGameTimeSlotAvailable, maxGameTimeSlotAvailable };
};

export const movePlayoffTimeSlots = (
  schedulesDetails: ISchedulesDetails[],
  timeSlots: ITimeSlot[],
  playoffTimeSlots: ITimeSlot[],
  day: string,
  direction: MovePlayoffWindowEnum
) => {
  const { minGameTimeSlotAvailable } = getMinMaxGameTimeSlots(
    schedulesDetails,
    timeSlots,
    day
  );

  const playoffStartTimeSlot = playoffTimeSlots[0];

  if (
    direction === MovePlayoffWindowEnum.UP &&
    playoffStartTimeSlot.id - minGameTimeSlotAvailable >= 1
  ) {
    const previousTimeSlot = timeSlots.find(
      (_, index, arr) => arr[index + 1].id === playoffStartTimeSlot.id
    );
    if (previousTimeSlot) {
      playoffTimeSlots.unshift(previousTimeSlot);
    }
  }

  if (direction === MovePlayoffWindowEnum.DOWN) {
    playoffTimeSlots.shift();
  }

  return playoffTimeSlots;
};

export const moveBracketGames = (
  bracketGames: IBracketGame[],
  schedulesDetails: ISchedulesDetails[],
  timeSlots: ITimeSlot[],
  day: string,
  direction: MovePlayoffWindowEnum
) => {
  const {
    minGameTimeSlotAvailable,
    maxGameTimeSlotAvailable,
  } = getMinMaxGameTimeSlots(schedulesDetails, timeSlots, day);

  const minGameStartTime = minBy(bracketGames, 'startTime')?.startTime;
  const minGameTimeSlot =
    timeSlots.find(item => item.time === minGameStartTime)?.id ||
    minGameTimeSlotAvailable;

  const maxGameStartTime = maxBy(bracketGames, 'startTime')?.startTime;
  const maxGameTimeSlot =
    timeSlots.find(item => item.time === maxGameStartTime)?.id ||
    maxGameTimeSlotAvailable;

  if (
    (minGameTimeSlotAvailable >= minGameTimeSlot &&
      direction === MovePlayoffWindowEnum.UP) ||
    (maxGameTimeSlotAvailable <= maxGameTimeSlot &&
      direction === MovePlayoffWindowEnum.DOWN)
  ) {
    return [...bracketGames];
  }

  return bracketGames.map(item => {
    if (!item.startTime || !item.fieldId) return item;

    const timeSlotId = timeSlots.find(v => v.time === item.startTime)?.id || 0;
    const previousTimeSlot = timeSlots.find(
      (_, index) => timeSlotId - index === 1
    );
    const nextTimeSlot = timeSlots.find((_, index) => index - timeSlotId === 1);

    const startTime =
      direction === MovePlayoffWindowEnum.UP
        ? previousTimeSlot?.time
        : nextTimeSlot?.time;

    return {
      ...item,
      startTime,
    };
  });
};

export const getPlayoffMovementAvailability = (
  schedulesDetails: ISchedulesDetails[],
  bracketGames: IBracketGame[],
  playoffTimeSlots: ITimeSlot[],
  timeSlots: ITimeSlot[],
  day: string
) => {
  const result = {
    upDisabled: true,
    downDisabled: true,
  };

  if (!playoffTimeSlots.length) return result;

  const {
    minGameTimeSlotAvailable,
    maxGameTimeSlotAvailable,
  } = getMinMaxGameTimeSlots(schedulesDetails, timeSlots, day);

  const lastGameStartTime = maxBy(bracketGames, 'startTime')?.startTime;
  const lastGameTimeSlotId =
    timeSlots.find(item => item.time === lastGameStartTime)?.id || 0;

  const upDisabled = Boolean(
    playoffTimeSlots[0].id <= minGameTimeSlotAvailable
  );

  const bracketTimeSlotNumExceeded = playoffTimeSlots.length <= 1;

  const downDisabled = Boolean(
    lastGameTimeSlotId >= maxGameTimeSlotAvailable || bracketTimeSlotNumExceeded
  );

  return {
    upDisabled,
    downDisabled,
  };
};
