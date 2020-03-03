export interface IDivision {
  division_id: string;
  event_id: string;
  long_name: string;
  short_name: string;
  is_premier_YN: null;
  entry_fee: number;
  division_description: string;
  division_hex: string;
  division_tag: string;
  max_num_teams: number;
  teams_registered: number;
  teams_tentitive: number;
  num_pools: number;
  division_message: string;
  game_duration_differ: null;
  game_duration_override: null;
  unique_bracket_game_duration: null;
  division_sort: null;
  latest_web_publish: string;
  is_active_YN: number;
  is_library_YN: null;
  created_by: string;
  created_datetime: string;
  updated_by: null;
  updated_datetime: null;
  //optional
  isPoolsLoading?: boolean;
  isPoolsLoaded?: boolean;
  isTeamsLoading?: boolean;
  isTeamsLoaded?: boolean;
}
