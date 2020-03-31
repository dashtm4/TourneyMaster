import { getVarcharEight } from 'helpers';
import { EntryPoints, IRegistrationFields } from 'common/enums';
import { IEntity } from 'common/types';

const generateEntityId = (entity: IEntity, entryPoint: EntryPoints) => {
  switch (entryPoint) {
    case EntryPoints.REGISTRATIONS: {
      return {
        ...entity,
        [IRegistrationFields.REGISTRATION_ID]: getVarcharEight(),
      };
    }
  }
};

export { generateEntityId };
