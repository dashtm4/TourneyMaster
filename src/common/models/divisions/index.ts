export interface IDivision {
  division_id: string;
  event_id: string;
  long_name: string;
  short_name: string;
  is_premier_YN: number;
  entry_fee: number;
  division_description: string;
  division_hex: string;
  division_tag: string;
  max_num_teams: number;
  teams_registered: number;
  teams_tentitive: number;
  num_pools: number;
  game_duration_differ: any;
  division_message: string;
  period_duration_override: any;
  division_sort: number;
  latest_web_publish: string;
  is_active_YN: number;
  is_library_YN: number;
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
}
