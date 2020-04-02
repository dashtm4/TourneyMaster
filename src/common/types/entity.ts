import {
  IRegistration,
  IEventDetails,
  IFacility,
  IDivision,
  IPool,
  ITeam,
} from 'common/models';

export type IEntity =
  | IEventDetails
  | IRegistration
  | IFacility
  | IDivision
  | IPool
  | ITeam;
