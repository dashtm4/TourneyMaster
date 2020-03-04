import {
  organizationManagementAction,
  LOAD_ORGANIZATIONS_START,
  LOAD_ORGANIZATIONS_SUCCESS,
  CREATE_ORGANIZATION_SUCCESS,
} from './action-types';
import { IOrganization } from '../../../common/models';

const initialState = {
  isLoading: false,
  isLoaded: false,
  organizations: [],
};

export interface AppState {
  isLoading: boolean;
  isLoaded: boolean;
  organizations: IOrganization[];
}

const organizationManagementReducer = (
  state: AppState = initialState,
  action: organizationManagementAction
) => {
  switch (action.type) {
    case LOAD_ORGANIZATIONS_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_ORGANIZATIONS_SUCCESS: {
      const { organizations } = action.payload;

      return {
        ...state,
        isLoaded: true,
        isLoading: false,
        organizations: organizations,
      };
    }
    case CREATE_ORGANIZATION_SUCCESS: {
      const { organization } = action.payload;

      return {
        ...state,
        organizations: [...state.organizations, organization],
      };
    }
    default:
      return state;
  }
};

export default organizationManagementReducer;
