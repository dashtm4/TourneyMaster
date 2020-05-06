enum EventPublishTypes {
  DETAILS = 'Event Divisions & Pools (No Games)',
  TOURNAMENT_PLAY = 'Tournament Play',
  BRACKETS = 'Playoff Brackets',
  DETAILS_AND_TOURNAMENT_PLAY = 'Event Details & Tournament Play Games',
  DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS = 'Event Details, Tournament Play, & Brackets',
}

enum EventModifyTypes {
  PUBLISH = 'Publish',
  UNPUBLISH = 'Unpublish',
}

export { EventPublishTypes, EventModifyTypes };
