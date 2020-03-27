const EMPTY_FACILITY = {
  facilities_description: '',
  facilities_abbr: null,
  num_fields: null,
  facilities_tag: null,
  address1: null,
  address2: null,
  city: '',
  state: null,
  zip: null,
  country: null,
  facility_lat: null,
  facility_long: null,
  facility_sort: null,
  public_access_YN: null,
  restrooms: null,
  num_toilets: null,
  restroom_details: null,
  parking_available: null,
  parking_details: null,
  parking_proximity: null,
  golf_carts_availabe: null,
  field_map_URL: null,
  is_active_YN: 0,
  in_library_YN: null,
};

const EMPTY_FIELD = {
  field_name: '',
  field_abbreviation: null,
  field_opentime: null,
  field_closetime: null,
  field_notes: null,
  field_sort: null,
  is_active_YN: null,
  is_library_YN: null,
  is_illuminated_YN: null,
  is_premier_YN: 0,
  created_by: null,
  created_datetime: null,
  updated_by: null,
  updated_datetime: null,
};

export { EMPTY_FACILITY, EMPTY_FIELD };
