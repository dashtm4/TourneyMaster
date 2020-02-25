enum Routes {
  DEFAULT = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  LIBRARY_MANAGER = '/library-manager',
  EVENT_LINK = '/event-link',
  COLLABORATION = '/colaboration',
  CALENDAR = '/calendar',
  UTILITIES = '/utilities',
  EVENT_DAY_COMPLEXITIES = '/event-day-complexities',
  EVENT_DETAILS = '/event/event-details/:eventId?',
  FACILITIES = '/event/facilities/:eventId?',
  REGISTRATION = '/event/registration/:eventId?',
  DIVISIONS_AND_POOLS = '/event/divisions-and-pools/:eventId?',
  ADD_DIVISION = '/event/divisions-and-pools-add/:eventId?',
  TEAMS = '/event/teams/:eventId?',
  SCHEDULING = '/event/scheduling/:eventId?',
  SCORING = '/event/scoring/:eventId?',
  REPORTING = '/event/reporting/:eventId?',
}

export { Routes };