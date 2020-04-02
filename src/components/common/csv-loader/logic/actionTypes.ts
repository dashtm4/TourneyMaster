import { ITableColumns } from '../index';

export const TABLE_COLUMNS_FETCH_SUCCESS = 'TABLE_COLUMNS_FETCH_SUCCESS';
export const MAPPING_FETCH_SUCCESS = 'MAPPING_FETCH_SUCCESS';

export interface TableColumnsFetchSuccess {
  type: 'TABLE_COLUMNS_FETCH_SUCCESS';
  payload: ITableColumns;
}

export interface MappingFetchSuccess {
  type: 'MAPPING_FETCH_SUCCESS';
  payload: any[];
}

export type TableColumnsAction = TableColumnsFetchSuccess | MappingFetchSuccess;
