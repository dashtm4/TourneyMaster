import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  TABLE_COLUMNS_FETCH_SUCCESS,
  MAPPING_FETCH_SUCCESS,
  TableColumnsAction,
} from './actionTypes';
import api from 'api/api';
import { getVarcharEight } from 'helpers';
import { Toasts } from 'components/common';
import { ITableColumns } from '../index';

export const getTableColumnsSuccess = (payload: ITableColumns): any => ({
  type: TABLE_COLUMNS_FETCH_SUCCESS,
  payload,
});

export const getMappingSuccess = (payload: any): any => ({
  type: MAPPING_FETCH_SUCCESS,
  payload,
});

export const getTableColumns: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TableColumnsAction
>> = (tableName: string) => async (dispatch: Dispatch) => {
  const response = await api.get(`/table_columns?table_name=${tableName}`);

  if (response) {
    dispatch(getTableColumnsSuccess(response));
  }
};

export const saveMapping: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TableColumnsAction
>> = (info: any) => async () => {
  const data = {
    member_map_id: getVarcharEight(),
    import_description: info.name,
    map_id_json: JSON.stringify(info.mapping),
    destination_table: info.destination_table,
  };
  const response = await api.post(`/data_import_history`, data);

  if (response) {
    return Toasts.successToast('Mapping is successfully saved');
  }
};

export const getMapping: ActionCreator<ThunkAction<
  void,
  {},
  null,
  TableColumnsAction
>> = (table: string) => async (dispatch: Dispatch) => {
  const response = await api.get(`/data_import_history`);
  const filteredMapping = response.filter(
    (mapping: any) => mapping.destination_table === table
  );

  if (response) {
    dispatch(getMappingSuccess(filteredMapping));
  }
};
