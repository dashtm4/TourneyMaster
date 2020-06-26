export interface IGameCell {
  homeTeamId: string;
  awayTeamId: string;
  divisionId: string;
  divisionHex: string;
  divisionName: string;
}

export interface ITableRunningTally {
  teamId: string;
  teamName: string;
  homeGamesNumber: number;
  awayGamesNumber: number;
  allGamesNumber: number;
}
