import {
  IRegistration,
  IEventDetails,
  IFacility,
  IDivision,
  ITeam,
} from 'common/models';

export type IEntity =
  | IEventDetails
  | IRegistration
  | IFacility
  | IDivision
  | ITeam;
