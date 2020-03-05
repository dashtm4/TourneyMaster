import { getVarcharEight } from 'helpers';

export const eventState = () => ({
  event_id: getVarcharEight(),
  sport_id: 1,
  org_id: '',
  event_name: '',
  event_description: '',
  event_startdate: new Date().toISOString(),
  event_enddate: new Date().toISOString(),
  time_zone_utc: -5,
  event_tag: '',
  event_format_id: 0,
  first_game_time: '',
  last_game_end: '',
  primary_location_desc: '',
  period_duration: '',
  periods_per_game: 2,
  exclusive_time_ranges_YN: 0,
  tie_breaker_format_id: 0,
  min_num_of_games: undefined,
  max_num_of_divisions: undefined,
  assoc_docs_URL: '',
  division_id: undefined,
  event_logo_path: '',
  is_active_YN: 0,
});

export enum UploadLogoTypes {
  MOBILE = 'mobile_icon_URL',
  DESKTOP = 'desktop_icon_URL',
}
