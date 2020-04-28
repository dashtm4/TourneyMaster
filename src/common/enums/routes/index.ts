enum Routes {
  DEFAULT = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  LIBRARY_MANAGER = '/library-manager',
  EVENT_LINK = '/event-link',
  CREATE_MESSAGE = '/event-link/create-message',
  COLLABORATION = '/collaboration',
  CALENDAR = '/calendar',
  UTILITIES = '/utilities',
  EVENT_DAY_COMPLEXITIES = '/event-day-complexities',
  ORGANIZATIONS_MANAGEMENT = '/organizations-management',
  EVENT_DETAILS = '/event/event-details',
  EVENT_DETAILS_ID = '/event/event-details/:eventId?',
  FACILITIES = '/event/facilities',
  FACILITIES_ID = '/event/facilities/:eventId?',
  REGISTRATION = '/event/registration',
  REGISTRATION_ID = '/event/registration/:eventId?',
  DIVISIONS_AND_POOLS = '/event/divisions-and-pools',
  DIVISIONS_AND_POOLS_ID = '/event/divisions-and-pools/:eventId?',
  ADD_DIVISION = '/event/divisions-and-pools-add/:eventId?',
  EDIT_DIVISION = '/event/divisions-and-pools-edit/:eventId?',
  TEAMS = '/event/teams',
  TEAMS_ID = '/event/teams/:eventId?',
  CREATE_TEAM = '/event/teams-create/:eventId?',
  SCHEDULING = '/event/scheduling',
  SCHEDULING_ID = '/event/scheduling/:eventId?',
  SCORING = '/event/scoring',
  SCORING_ID = '/event/scoring/:eventId?',
  SCHEDULES = '/schedules',
  SCHEDULES_ID = '/schedules/:eventId/:scheduleId?',
  PLAYOFFS = '/playoffs',
  PLAYOFFS_ID = '/playoffs/:eventId/:scheduleId/:bracketId?',
  REPORTING = '/event/reporting',
  REPORTING_ID = '/event/reporting/:eventId?',
  RECORD_SCORES = '/event/record-scores/',
  RECORD_SCORES_ID = '/event/record-scores/:eventId?',
}

export { Routes };
