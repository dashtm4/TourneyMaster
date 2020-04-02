export interface ISchedulesGame {
  game_id: string;
  event_id: string;
  schedule_id: string;
  sport_id: number;
  facilities_id: string;
  field_id: string;
  game_date: string;
  start_time: string | null;
  away_team_id: string | null;
  home_team_id: string | null;
  away_team_score: string | number | null;
  home_team_score: string | number | null;
  is_active_YN: number;
  is_final_YN: number | null;
  finalized_by: string | null;
  finalized_datetime: string | null;
  is_bracket_YN: number | null;
  away_team_locked: string | null;
  home_team_locked: string | null;
  game_is_locked_YN: number | null;
  created_by: string;
  created_datetime: string;
  updated_by: string | null;
  updated_datetime: string | null;
}
