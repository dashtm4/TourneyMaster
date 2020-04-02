import { getVarcharEight } from 'helpers';
import {
  EntryPoints,
  IRegistrationFields,
  IFacilityFields,
} from 'common/enums';
import { IEntity } from 'common/types';

const generateEntityId = (entity: IEntity, entryPoint: EntryPoints) => {
  switch (entryPoint) {
    case EntryPoints.REGISTRATIONS: {
      return {
        ...entity,
        [IRegistrationFields.REGISTRATION_ID]: getVarcharEight(),
      };
    }
    case EntryPoints.FACILITIES: {
      return {
        ...entity,
        [IFacilityFields.FACILITIES_ID]: getVarcharEight(),
      };
    }
  }

  return entity;
};

export { generateEntityId };
