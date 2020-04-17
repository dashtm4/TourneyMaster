import { Dispatch } from 'redux';
import { IAppState } from 'reducers/root-reducer.types';
import { chunk, orderBy } from 'lodash-es';
import {
  PLAYOFF_SAVED_SUCCESS,
  PLAYOFF_FETCH_GAMES,
  PLAYOFF_CLEAR_GAMES,
} from './actionTypes';
import {
  mapBracketData,
  mapBracketGames,
  mapFetchedBracket,
  mapFetchedBracketGames,
} from '../mapBracketsData';
import { IBracketGame } from '../bracketGames';
import api from 'api/api';
import { successToast, errorToast } from 'components/common/toastr/showToasts';
import { addNewBracket } from 'components/scheduling/logic/actions';

type IGetState = () => IAppState;

const playoffSavedSuccess = (payload: boolean) => ({
  type: PLAYOFF_SAVED_SUCCESS,
  payload,
});

export const fetchBracketGames = (payload: IBracketGame[]) => ({
  type: PLAYOFF_FETCH_GAMES,
  payload,
});

export const clearBracketGames = () => ({
  type: PLAYOFF_CLEAR_GAMES,
});

const newError = () =>
  errorToast('An error occurred while saving the playoff data');

const callPostPut = (uri: string, data: any, isUpdate: boolean) =>
  isUpdate ? api.put(uri, data) : api.post(uri, data);

const managePlayoffSaving = (
  bracketGames: IBracketGame[],
  isCreate: boolean
) => async (dispatch: Dispatch, getState: IGetState) => {
  const { scheduling } = getState();
  const { bracket } = scheduling;

  if (!bracket) return newError();

  // POST/PUT Bracket
  const bracketData = await mapBracketData(bracket, true);
  const bracketResp = await callPostPut(
    '/brackets_details',
    bracketData,
    !isCreate
  );

  if (!bracketResp) return newError();

  // POST/PUT BracketGames
  const bracketGamesData = await mapBracketGames(bracketGames, bracket);
  const bracketGamesChunk = chunk(bracketGamesData, 50);
  const bracketGamesResp = await Promise.all(
    bracketGamesChunk.map(
      async arr => await callPostPut('/games_brackets', arr, !isCreate)
    )
  );
  const bracketGamesRespOk = bracketGamesResp.every(item => item);

  if (bracketResp && bracketGamesRespOk) {
    dispatch(playoffSavedSuccess(true));
    successToast('Playoff data was successfully saved!');
    return;
  }

  dispatch(playoffSavedSuccess(false));
  errorToast('Something happened during the saving process');
};

export const createPlayoff = (bracketGames: IBracketGame[]) => (
  dispatch: Dispatch
) => {
  dispatch<any>(managePlayoffSaving(bracketGames, true));
};

export const savePlayoff = (bracketGames: IBracketGame[]) => (
  dispatch: Dispatch
) => {
  dispatch<any>(managePlayoffSaving(bracketGames, false));
};

export const retrieveBrackets = (bracketId: string) => async (
  dispatch: Dispatch
) => {
  const response = await api.get('/brackets_details', {
    bracket_id: bracketId,
  });

  if (response?.length) {
    const bracketData = mapFetchedBracket(response[0]);
    dispatch(addNewBracket(bracketData));
  }
};

export const retrieveBracketsGames = (bracketId: string) => async (
  dispatch: Dispatch
) => {
  const response = await api.get('/games_brackets', { bracket_id: bracketId });

  if (response?.length) {
    const bracketGames = mapFetchedBracketGames(response);
    const orderedGames = orderBy(bracketGames, ['divisionId', 'index']);
    dispatch(fetchBracketGames(orderedGames));
  }
};