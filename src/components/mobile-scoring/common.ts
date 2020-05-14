import { ISchedulesGameWithNames } from 'common/models';

export interface IMobileScoringGame extends ISchedulesGameWithNames {
  facilityId: string | null;
  facilityName: string | null;
}

export enum ScoresRaioOptions {
  ALL = 'All',
  UNSCORED_GAMES = 'Unscored games',
}
