import { IGame } from 'components/common/matrix-table/helper';

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
