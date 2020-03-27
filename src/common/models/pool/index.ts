export interface IPool {
  pool_id: string;
  event_id: string;
  division_id: string;
  pool_desc: string;
  pool_name: string;
  pool_tag: string;
  is_active_YN: boolean;
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
  //optional
  isTeamsLoading?: boolean;
  isTeamsLoaded?: boolean;
}

export interface ISelectPool {
  id: string;
  name: string;
}
