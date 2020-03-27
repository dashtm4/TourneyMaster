import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IEventState } from 'components/event-details/logic/reducer';
import { IFacilitiesState } from 'components/facilities/logic/reducer';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import { ISchedulesState } from 'components/schedules/logic/reducer';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { ISchedulesTableState } from 'components/schedules/logic/schedules-table/schedulesTableReducer';
import { IRecordScoresState } from 'components/scoring/pages/record-scores/logic/reducer';

export interface IAppState {
  pageEvent: IPageEventState;
  event: IEventState;
  facilities: IFacilitiesState;
  divisions: IDivisionAndPoolsState;
  schedules: ISchedulesState;
  scheduling: ISchedulingState;
  schedulesTable: ISchedulesTableState;
  recordScores: IRecordScoresState;
}
