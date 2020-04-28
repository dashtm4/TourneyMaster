import { IBracketGame } from '../bracketGames';
import { ITeamWithResults } from 'common/models';
import { IPlayoffSortedTeams } from './actions';

export const PLAYOFF_SAVED_SUCCESS = 'PLAYOFF_SAVED_SUCCESS';
export const PLAYOFF_FETCH_GAMES = 'PLAYOFF_FETCH_GAMES';
export const PLAYOFF_CLEAR_GAMES = 'PLAYOFF_CLEAR_GAMES';
export const PLAYOFF_UNDO_GAMES = 'PLAYOFF_UNDO_GAMES';

export const LOAD_DATA_WITH_SCORES = 'BRACKETS:LOAD_DATA_WITH_SCORES';
export const FETCH_SCORED_TEAMS = 'BRACKETS:FETCH_SCORED_TEAMS';

interface IPlayoffSavedSuccess {
  type: 'PLAYOFF_SAVED_SUCCESS';
  payload: boolean;
}

interface IPlayoffFetchGames {
  type: 'PLAYOFF_FETCH_GAMES';
  payload: IBracketGame[];
}

interface IPlayoffClearGames {
  type: 'PLAYOFF_CLEAR_GAMES';
}

interface IPlayoffUndoGames {
  type: 'PLAYOFF_UNDO_GAMES';
}

interface ILoadDataWithScores {
  type: 'BRACKETS:LOAD_DATA_WITH_SCORES';
  payload: { scoredTeams: ITeamWithResults[] };
}

interface IFetchSortedTeams {
  type: 'BRACKETS:FETCH_SCORED_TEAMS';
  payload: IPlayoffSortedTeams;
}

export type IPlayoffAction =
  | IPlayoffSavedSuccess
  | IPlayoffFetchGames
  | IPlayoffClearGames
  | IPlayoffUndoGames
  | ILoadDataWithScores
  | IFetchSortedTeams;
