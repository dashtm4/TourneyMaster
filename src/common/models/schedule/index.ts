export interface ISchedule {
  schedule_id: string;
  event_id: string;
  member_id: string;
  schedule_name: string | null;
  schedule_tag: string | null;
  num_divisions: number;
  num_teams: number;
  min_num_games: string | null;
  max_num_games: string | null;
  schedule_status: string;
  last_web_publish: string;
  games_start_on: string | null;
  period_duration: string | null;
  pre_game_warmup: string | null;
  time_btwn_periods: string | null;
  is_active_YN: number;
  is_library_YN: number;
  // ! from server
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
}

export interface IConfigurableSchedule extends ISchedule {
  num_fields: number | null;
  periods_per_game: number;
  first_window_time: string | null;
  last_window_time: string | null;
  total_game_slots: string | null;
}
