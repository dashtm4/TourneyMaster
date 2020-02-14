import api from 'api/api';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';
import { getVarcharEight } from 'helpers';
import { IDivision } from 'common/models/divisions';

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
