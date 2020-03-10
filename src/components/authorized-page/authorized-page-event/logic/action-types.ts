import { ITournamentData, IEvent } from 'common/models';

export const LOAD_AUTH_PAGE_DATA_START = 'LOAD_AUTH_PAGE_DATA_START';
export const LOAD_AUTH_PAGE_DATA_SUCCESS = 'LOAD_AUTH_PAGE_DATA_SUCCESS';
export const LOAD_AUTH_PAGE_DATA_FAILURE = 'LOAD_AUTH_PAGE_DATA_FAILURE';

export const CLEAR_AUTH_PAGE_DATA = 'CLEAR_AUTH_PAGE_DATA';

export const PUBLISH_TOURNAMENT_SUCCESS = 'PUBLISH_TOURNAMENT_SUCCESS';
export const PUBLISH_TOURNAMENT_FAILURE = 'PUBLISH_TOURNAMENT_FAILURE';

export interface loadAuthPageDataStart {
  type: 'LOAD_AUTH_PAGE_DATA_START';
}

export interface loadAuthPageDataSuccess {
  type: 'LOAD_AUTH_PAGE_DATA_SUCCESS';
  payload: {
    tournamentData: ITournamentData;
  };
}

export interface cleatAuthPageData {
  type: 'CLEAR_AUTH_PAGE_DATA';
}

export interface publishTournamentSuccess {
  type: 'PUBLISH_TOURNAMENT_SUCCESS';
  payload: {
    event: IEvent;
  };
}

export type AuthPageAction =
  | loadAuthPageDataStart
  | loadAuthPageDataSuccess
  | cleatAuthPageData
  | publishTournamentSuccess;
