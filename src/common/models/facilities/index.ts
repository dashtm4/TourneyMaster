export interface IFacilityField {
  name: string;
}

export interface IFacility {
  isChange?: boolean;
  event_id: string;
  facilities_id: string;
  facilities_description: string | null;
  num_fields: number | null;
  restrooms: string | null;
  num_toilets: number | null;
  restroom_details: string | null;
  parking_available: string | null;
  parking_details: string | null;
  parking_proximity: number | null;
  golf_carts_availabe: boolean | null;
  created_by: string;
}
