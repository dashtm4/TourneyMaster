import api from 'api/api';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';
import { getVarcharEight } from 'helpers';
import { IDivision } from 'common/models/divisions';
import { DIVISION_FETCH_SUCCESS, DIVISION_FETCH_FAILURE } from './actionTypes';

export const divisionFetchSuccess = (
  payload: any
): { type: string; payload: any } => ({
  type: DIVISION_FETCH_SUCCESS,
  payload,
});

export const divisionFetchFailure = (): { type: string } => ({
  type: DIVISION_FETCH_FAILURE,
});

export const getDivision: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string) => async (dispatch: any) => {
  const data = await api.get('/divisions', { division_id: divisionId });
  dispatch(divisionFetchSuccess(data));
};

export const updateDivision: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisionId: string, divisions: Partial<IDivision>[]) => async (
  _dispatch,
  getState
) => {
  const {
    event: {
      data: { event_id, created_by },
    },
  }: any = getState();

  const data = {
    ...divisions[0],
    event_id,
    created_by,
    division_id: divisionId,
  };
  const response = await api.put(`/divisions?division_id=${divisionId}`, data);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't add a division");
  }

  Toasts.successToast('Division is successfully added');
};

export const saveDivisions: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (divisions: Partial<IDivision>[]) => async (_dispatch, getState) => {
  const {
    event: {
      data: { event_id, created_by },
    },
  }: any = getState();

  divisions.forEach(async (division: Partial<IDivision>) => {
    const data = {
      ...division,
      event_id,
      created_by,
      division_id: getVarcharEight(),
    };
    const response = await api.post(`/divisions`, data);
    if (response?.errorType === 'Error') {
      return Toasts.errorToast("Couldn't add a division");
    }
  });

  Toasts.successToast('Division is successfully added');
};
