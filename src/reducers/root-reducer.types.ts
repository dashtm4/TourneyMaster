import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IEventState } from 'components/event-details/logic/reducer';
import { IFacilitiesState } from 'components/facilities/logic/reducer';
import { ISchedulingState } from 'components/scheduling/logic/reducer';

export interface IAppState {
  pageEvent: IPageEventState;
  event: IEventState;
  facilities: IFacilitiesState;
  scheduling: ISchedulingState;
}
