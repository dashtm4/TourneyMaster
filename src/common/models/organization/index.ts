export interface IOrganization {
  org_id: string;
  org_name: string;
  org_tag: string | null;
  city: string | null;
  state: string | null;
  is_active_YN: number | null;
  //! from server
  created_by?: string;
  created_datetime?: string;
  updated_by?: string;
  updated_datetime?: string;
}

export interface IConfigurableOrganization {
  org_name: string;
  org_tag: null | string;
  city: null | string;
  state: null | string;
}
