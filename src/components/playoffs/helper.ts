import { orderBy } from 'lodash-es';
import { IGame } from 'components/common/matrix-table/helper';
import { IBracketGame } from './bracketGames';
import { IOnAddGame } from './add-game-modal';
import { getVarcharEight } from 'helpers';

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
    createDate: new Date().toISOString(),
  };

  const newBracketGames = bracketGames.map(item => {
    if (item.id === awayDependent.id) return awayDependent;
    if (item.id === homeDependent.id) return homeDependent;
    return item;
  });

  newBracketGames.push(newBracketGame);

  return newBracketGames;
};

const getDependentGames = (
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
    return newDependentInds;
  }

  return getDependentGames(newDependentInds, newGames);
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

  const otherGames = games.filter(
    item => !newFound.includes(item.index) && item.divisionId !== divisionId
  );

  const allGames = orderBy(
    [...otherGames, ...updatedDivisionGames],
    'divisionId'
  );

  const resultGames: IBracketGame[] = [...allGames, ...removedGames];
  return resultGames;
};
