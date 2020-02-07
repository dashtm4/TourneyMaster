export interface EventDetailsDTO {
  event_id: string;
  sport_id: number;
  org_id: string;
  event_name: string;
  event_description: string;
  event_startdate: string;
  event_enddate: string;
  time_zone_utc: number;
  event_tag: string;
  event_format_id: number;
  event_status: string;
  first_game_time: string;
  last_game_end: string;
  num_of_locations: number;
  primary_location_desc: string;
  pre_game_warmup: string | null;
  period_duration: string;
  time_btwn_periods: string;
  periods_per_game: number;
  exclusive_time_ranges_YN: number;
  tie_breaker_format_id: number;
  min_num_of_games: number;
  event_type: string;
  playoffs_exist: number;
  max_num_of_divisions: number;
  ranking_factor_divisions: null;
  bracket_type: null;
  ranking_factor_pools: null;
  num_teams_bracket: null;
  max_num_teams_per_division: number;
  show_goals_scored: number;
  show_goals_allowed: number;
  show_goals_diff: null;
  assoc_docs_URL: string;
  division_id: number;
  event_logo_path: string;
  mobile_icon_URL: string;
  desktop_icon_URL: string;
  back_to_back_warning: true | null;
  is_active_YN: number;
  is_library_YN: number;
  num_games_completed: number;
  last_web_published: null;
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
}
