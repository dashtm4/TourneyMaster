enum Routes {
  DEFAULT = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  LIBRARY_MANAGER = '/library-manager',
  EVENT_LINK = '/event-link',
  COLLABORATION = '/collaboration',
  CALENDAR = '/calendar',
  UTILITIES = '/utilities',
  EVENT_DAY_COMPLEXITIES = '/event-day-complexities',
  ORGANIZATIONS_MANAGEMENT = '/organizations-management',
  EVENT_DETAILS = '/event/event-details/:eventId?',
  FACILITIES = '/event/facilities/:eventId?',
  REGISTRATION = '/event/registration/:eventId?',
  DIVISIONS_AND_POOLS = '/event/divisions-and-pools/:eventId?',
  ADD_DIVISION = '/event/divisions-and-pools-add/:eventId?',
  EDIT_DIVISION = '/event/divisions-and-pools-edit/:eventId?',
  TEAMS = '/event/teams/:eventId?',
  CREATE_TEAM = '/event/teams-create/:eventId?',
  SCHEDULING = '/event/scheduling/:eventId?',
  SCORING = '/event/scoring/',
  SCORING_ID = '/event/scoring/:eventId?',
  SCHEDULES = '/schedules/',
  REPORTING = '/event/reporting/:eventId?',
  RECORD_SCORES = '/event/record-scores/',
  RECORD_SCORES_ID = '/event/record-scores/:eventId?',
}

export { Routes };
