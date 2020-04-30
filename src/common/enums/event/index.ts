enum EventStatuses {
  'Draft' = 0,
  'Published' = 1,
}

enum IEventDetailsFields {
  EVENT_ID = 'event_id',
  SPORT_ID = 'sport_id',
  ORG_ID = 'org_id',
  EVENT_NAME = 'event_name',
  EVENT_DESCRIPTION = 'event_description',
  MAIN_CONTACT = 'main_contact',
  MAIN_CONTACT_MOBILE = 'main_contact_mobile',
  MAIN_CONTACT_EMAIL = 'main_contact_email',
  EVENT_STARTDATE = 'event_startdate',
  EVENT_ENDDATE = 'event_enddate',
  TIME_ZONE_UTC = 'time_zone_utc',
  EVENT_LEVEL = 'event_level',
  EVENT_TAG = 'event_tag',
  EVENT_FORMAT_ID = 'event_format_id',
  FIRST_GAME_TIME = 'first_game_time',
  LAST_GAME_END = 'last_game_end',
  NUM_OF_LOCATIONS = 'num_of_locations',
  PRIMARY_LOCATION_DESC = 'primary_location_desc',
  PRIMARY_LOCATION_CITY = 'primary_location_city',
  PRIMARY_LOCATION_STATE = 'primary_location_state',
  PRIMARY_LOCATION_LONG = 'primary_location_long',
  PRIMARY_LOCATION_LAT = 'primary_location_lat',
  PRE_GAME_WARMUP = 'pre_game_warmup',
  PERIOD_DURATION = 'period_duration',
  TIME_BTWN_PERIODS = 'time_btwn_periods',
  PERIODS_PER_GAME = 'periods_per_game',
  EXCLUSIVE_TIME_RANGES_YN = 'exclusive_time_ranges_YN',
  WAIVERS_REQUIRED = 'waivers_required',
  WAIVERHUB_UTILIZED = 'waiverhub_utilized',
  BACK_TO_BACK_WARNING = 'back_to_back_warning',
  TIE_BREAKER_FORMAT_ID = 'tie_breaker_format_id',
  MIN_NUM_OF_GAMES = 'min_num_of_games',
  EVENT_TYPE = 'event_type',
  PLAYOFFS_EXIST = 'playoffs_exist',
  MAX_NUM_OF_DIVISIONS = 'max_num_of_divisions',
  BRACKET_TYPE = 'bracket_type',
  RANKING_FACTOR_DIVISIONS = 'ranking_factor_divisions',
  RANKING_FACTOR_POOLS = 'ranking_factor_pools',
  BRACKET_DURATIONS_VARY = 'bracket_durations_vary',
  BRACKET_DURATION = 'bracket_duration',
  BRACKET_TIME_BTWN_PERIODS = 'bracket_time_btwn_periods',
  NUM_TEAMS_BRACKET = 'num_teams_bracket',
  MAX_NUM_TEAMS_PER_DIVISION = 'max_num_teams_per_division',
  SHOW_GOALS_SCORED = 'show_goals_scored',
  SHOW_GOALS_ALLOWED = 'show_goals_allowed',
  SHOW_GOALS_DIFF = 'show_goals_diff',
  ASSOC_DOCS_URL = 'assoc_docs_URL',
  EVENT_LOGO_PATH = 'event_logo_path',
  MOBILE_ICON_URL = 'mobile_icon_URL',
  DESKTOP_ICON_URL = 'desktop_icon_URL',
  IS_ACTIVE_YN = 'is_active_YN',
  IS_LIBRARY_YN = 'is_library_YN',
  IS_PUBLISHED_YN = 'is_published_YN',
  NUM_GAMES_COMPLETED = 'num_games_completed',
  LAST_WEB_PUBLISHED = 'last_web_published',
  CREATED_BY = 'created_by',
  CREATED_DATETIME = 'created_datetime',
  UPDATED_BY = 'updated_by',
  UPDATED_DATETIME = 'updated_datetime',
}

export { EventStatuses, IEventDetailsFields };
