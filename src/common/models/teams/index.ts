export interface ITeam {
  team_id: string;
  event_id: string | null;
  org_id: number | null;
  long_name: string | null;
  short_name: string | null;
  team_tag: string | null;
  city: string | null;
  state: string | null;
  level: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  phone_num: string | null;
  contact_email: string | null;
  schedule_restrictions: number | null;
  is_active_YN: number | null;
  is_library_YN: number | null;
  created_by: string | null;
  created_datetime: string | null;
  updated_by: string | null;
  updated_datetime: string | null;
  division_id: string | null;
  pool_id: string | null;
  //Optional
  isChange: boolean
}
