import {
  IEventDetails,
  IRegistration,
  IFacility,
  IDivision,
  ITeam,
} from 'common/models';

export interface ITournamentData {
  event: IEventDetails | null;
  registration: IRegistration | null;
  facilities: IFacility[];
  divisions: IDivision[];
  teams: ITeam[];
}
