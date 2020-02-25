export interface ITeam {
  team_id: string;
  event_id: string;
  org_id: number;
  long_name: string;
  short_name: string;
  team_tag: string;
  city: string;
  state: string;
  level: string;
  contact_first_name: string;
  contact_last_name: string;
  phone_num: string;
  contact_email: string;
  schedule_restrictions: number;
  is_active_YN: number;
  is_library_YN: number;
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
  division_id: string;
  pool_id: string | null;
}
