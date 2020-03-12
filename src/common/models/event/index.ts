import { EventStatuses } from 'common/enums';

export interface IEventDetails {
  event_id: string;
  event_status: EventStatuses;
  event_name: string | null;
}
