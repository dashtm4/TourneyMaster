import { IRegistration, IPool, ITeam } from 'common/models';

export interface ILibraryManagerRegistration extends IRegistration {
  eventName: string;
}

export interface IPoolWithTeams extends IPool {
  teams: ITeam[];
}

export interface ITableSortEntity {
  id: string;
  title: string;
  lastModified: string;
}
