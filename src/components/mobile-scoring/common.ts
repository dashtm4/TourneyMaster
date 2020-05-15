import { ISchedulesGameWithNames } from 'common/models';

export interface IMobileScoringGame extends ISchedulesGameWithNames {
  facilityId: string | null;
  facilityName: string | null;
  isPlayoff?: boolean;
  awaySeedId?: number | null;
  homeSeedId?: number | null;
  awayDependsUpon?: number | null;
  homeDependsUpon?: number | null;
  round?: number | null;
}

export enum ScoresRaioOptions {
  ALL = 'All',
  UNSCORED_GAMES = 'Unscored games',
}
