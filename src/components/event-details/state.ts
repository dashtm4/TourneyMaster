import { getVarcharEight } from 'helpers';

export const eventState = () => ({
  event_id: getVarcharEight(),
  sport_id: 1,
  org_id: '',
  event_name: '',
  event_description: '',
  main_contact: null,
  main_contact_mobile: null,
  main_contact_email: null,
  event_startdate: new Date().toISOString(),
  event_enddate: new Date().toISOString(),
  time_zone_utc: -5,
  event_tag: '',
  event_level: 'Other',
  event_status: 'Draft',
  event_format_id: 0,
  first_game_time: '08:30:00',
  last_game_end: '17:30:00',
  primary_location_desc: '',
  period_duration: '',
  periods_per_game: 2,
  exclusive_time_ranges_YN: 0,
  tie_breaker_format_id: 0,
  min_num_of_games: undefined,
  max_num_of_divisions: undefined,
  assoc_docs_URL: '',
  division_id: undefined,
  is_active_YN: 0,
});

export enum UploadLogoTypes {
  MOBILE = 'mobile_icon_URL',
  DESKTOP = 'desktop_icon_URL',
}
