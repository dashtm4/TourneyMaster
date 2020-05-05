enum EventPublishTypes {
  DETAILS = 'Event Divisions & Pools (No Games)',
  TOURNAMENT_PLAY = 'Tournament Play',
  BRACKETS = 'Playoff Brackets',
  DETAILS_AND_TOURNAMENT_PLAY = 'Details + Tournament Plays',
  DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS = 'Details, Tournament Plays, Brackets',
}

enum EventModifyTypes {
  PUBLISH = 'Publish',
  UNPUBLISH = 'Unpublish',
}

export { EventPublishTypes, EventModifyTypes };
