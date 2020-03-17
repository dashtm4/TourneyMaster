import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IFacilitiesState } from 'components/facilities/logic/reducer';
import { ISchedulesState } from 'components/schedules/logic/reducer';

export interface IAppState {
  pageEvent: IPageEventState;
  facilities: IFacilitiesState;
  schedules: ISchedulesState;
}
