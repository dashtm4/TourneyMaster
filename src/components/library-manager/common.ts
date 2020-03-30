import { IRegistration } from 'common/models';

export interface ILibraryManagerRegistration extends IRegistration {
  // ! in future it can not be null(now database has it field like null)
  eventName: string | null;
}

enum ILibraryManagerRegistrationFields {
  EVENT_NAME = 'eventName',
}

export { ILibraryManagerRegistrationFields };
