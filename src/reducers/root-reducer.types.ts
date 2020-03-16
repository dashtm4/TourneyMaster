import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IFacilitiesState } from 'components/facilities/logic/reducer';

export interface IAppState {
  pageEvent: IPageEventState;
  facilities: IFacilitiesState;
}
