import { Dispatch } from 'redux';
import { IAppState } from 'reducers/root-reducer.types';
import { PLAYOFF_SAVED_SUCCESS } from './actionTypes';
import { mapBracketData, mapBracketGames } from '../mapBracketsData';
import { IBracketGame } from '../bracketGames';
import api from 'api/api';
import { chunk } from 'lodash-es';
import { successToast, errorToast } from 'components/common/toastr/showToasts';

type IGetState = () => IAppState;

const playoffSavedSuccess = (payload: boolean) => ({
  type: PLAYOFF_SAVED_SUCCESS,
  payload,
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
  const bracketResp = await callPostPut('/brackets', bracketData, !isCreate);
  console.log('bracketData:', bracketData);

  if (!bracketResp) return newError();

  // POST/PUT BracketGames
  const bracketGamesData = await mapBracketGames(bracketGames, bracket);
  const bracketGamesChunk = chunk(bracketGamesData, 50);
  const bracketGamesResp = await Promise.all(
    bracketGamesChunk.map(
      async arr => await callPostPut('/bracket_games', arr, !isCreate)
    )
  );
  const bracketGamesRespOk = bracketGamesResp.every(item => item);
  console.log('bracketGamesData:', bracketGamesData);

  if (bracketResp && bracketGamesRespOk) {
    dispatch(playoffSavedSuccess(true));
    successToast('Playoff data was successfully saved!');
    return;
  }

  dispatch(playoffSavedSuccess(false));
  errorToast('Something happened during the savin process');
};

export const createPlayoff = (bracketGames: IBracketGame[]) => (
  dispatch: Dispatch
) => {
  dispatch<any>(managePlayoffSaving(bracketGames, true));
};

export const savePlayoff = (bracketGames: IBracketGame[]) => () => (
  dispatch: Dispatch
) => {
  dispatch<any>(managePlayoffSaving(bracketGames, false));
};
