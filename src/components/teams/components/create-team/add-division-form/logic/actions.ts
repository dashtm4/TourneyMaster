import api from 'api/api';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';

export const saveDivision: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (division: any) => async () => {
  const response = await api.post(`/divisions`, division);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't add a division");
  }

  Toasts.successToast('Division is successfully added');
};
