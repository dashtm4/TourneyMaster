export interface ISchedule {
  schedule_id: string;
  event_id: string;
  member_id: string;
  num_divisions: number;
  num_teams: number;
  schedule_status: string;
  last_web_publish: string;
  games_start_on?: string | null;
  is_active_YN: number;
  is_library_YN: number;
  // ! from server
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
  // ! optional
  num_fields: null;
  // ! not exist now
  min_num_of_games: string | null;
  pre_game_warmup: string | null;
  period_duration: string | null;
  time_btwn_periods: string | null;
  first_window_time: string | null;
  last_window_time: string | null;
  total_game_slots: string | null;
  name: string | null;
  tag: string | null;
}
