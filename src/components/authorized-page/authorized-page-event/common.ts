import { ISchedule, IFetchedBracket } from 'common/models';

export interface IPublishSettings {
  activeSchedule: ISchedule;
  activeBracket: IFetchedBracket;
}

enum EventPublishTypes {
  DETAILS = 'Division & Pools (Details)',
  DETAILS_AND_TOURNAMENT_PLAY = 'Details + Tournament Plays',
  DETAILS_AND_TOURNAMENT_PLAY_AND_BRACKETS = 'Details, Tournament Plays, Brackets',
}

enum PublishSettingFields {
  ACTIVE_SCHEDULE = 'activeSchedule',
  ACTIVE_BRACKET = 'activeBracket',
}

export { EventPublishTypes, PublishSettingFields };
