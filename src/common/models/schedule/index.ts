export interface ISchedule {
  schedule_id: string;
  event_id: string;
  member_id: string;
  num_divisions: number;
  num_teams: number;
  schedule_status: string;
  last_web_publish: string;
  is_active_YN: number;
  is_library_YN: number;
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
}
