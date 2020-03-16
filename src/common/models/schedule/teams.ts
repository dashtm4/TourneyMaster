export interface IFetchedTeam {
  team_id: string;
  event_id: string;
  org_id?: string | null;
  division_id: string;
  pool_id: string;
  long_name: string;
  short_name: string;
  team_tag: string;
  city?: string | null;
  state?: string | null;
  level?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  phone_num?: string | null;
  contact_email?: string | null;
  schedule_restrictions?: string | null;
  is_active_YN: 1 | 0 | null;
  is_library_YN: 1 | 0 | null;
  created_by: string;
  created_datetime: string;
  updated_by?: string | null;
  updated_datetime?: string | null;
}

export interface ITeam {
  id: string;
  name: string;
  startTime: string;
  poolId: string;
  divisionId: string;
  isPremier: boolean;
}

export interface ITeamCard extends ITeam {
  games?: number[];
  fieldId?: string;
  timeSlotId?: number;
  teamPosition?: number;
}