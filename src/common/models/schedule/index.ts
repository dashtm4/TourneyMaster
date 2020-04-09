export enum ScheduleStatuses {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
}

export interface ISchedule {
  schedule_id: string;
  event_id: string;
  member_id: string;
  schedule_name: string;
  schedule_tag: string | null;
  num_divisions: number;
  num_teams: number;
  min_num_games: string | null;
  max_num_games: string | null;
  schedule_status: string;
  last_web_publish: string;
  games_start_on: string;
  period_duration: string;
  pre_game_warmup: string | null;
  time_btwn_periods: string;
  is_active_YN: number;
  is_library_YN: 0 | 1 | null;
  // ! from server
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
}

export interface IConfigurableSchedule extends ISchedule {
  num_fields: number;
  periods_per_game: number;
  first_game_start: string;
  last_game_end: string;
  isManualScheduling?: boolean;
}
