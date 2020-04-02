import {
  TABLE_COLUMNS_FETCH_SUCCESS,
  MAPPING_FETCH_SUCCESS,
  TableColumnsAction,
} from './actionTypes';

interface ITableColumns {
  map_id: number;
  table_name: string;
  is_active_YN: number;
  created_by: string;
  table_details: string;
}

export interface ITableColumnsState {
  data?: ITableColumns;
  mappings: any[];
}

const defaultState: ITableColumnsState = {
  data: undefined,
  mappings: [],
};

export default (state = defaultState, action: TableColumnsAction) => {
  switch (action.type) {
    case TABLE_COLUMNS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload[0],
      };
    }
    case MAPPING_FETCH_SUCCESS: {
      return {
        ...state,
        mappings: action.payload,
      };
    }
    default:
      return state;
  }
};
