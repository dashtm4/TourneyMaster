import Api from '../../api/api';
import { getVarcharEight, removeAuxiliaryFields } from 'helpers';
import {
  EntryPoints,
  IRegistrationFields,
  IFacilityFields,
} from 'common/enums';
import { IEntity } from 'common/types';
import { IRegistration, IEventDetails, IFacility, IField } from 'common/models';

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

const getClearScharedItem = (
  sharedItem: IEntity,
  event: IEventDetails,
  entryPoint: EntryPoints
) => {
  const mappedSharedItem = {
    ...sharedItem,
    event_id: event.event_id,
  };

  const sharedItemWithNewId = generateEntityId(mappedSharedItem, entryPoint);

  const clearSharedItem = removeAuxiliaryFields(
    sharedItemWithNewId,
    entryPoint
  );

  return clearSharedItem;
};

const checkAleadyExist = async (
  sharedItem: IEntity,
  event: IEventDetails,
  entryPoint: EntryPoints
) => {
  const ownSharedItems = await Api.get(
    `${entryPoint}?event_id=${event.event_id}`
  );

  switch (entryPoint) {
    case EntryPoints.REGISTRATIONS: {
      const registration = sharedItem as IRegistration;

      if (
        ownSharedItems.some(
          (it: IRegistration) =>
            it.registration_id === registration.registration_id
        )
      ) {
        throw new Error('The event already has such a registration');
      }
    }
    case EntryPoints.FACILITIES: {
      const facility = sharedItem as IFacility;

      if (
        ownSharedItems.some(
          (it: IFacility) => it.facilities_id === facility.facilities_id
        )
      ) {
        throw new Error('The event already has such a facility');
      }
    }
  }
};

const setRegistrationFromLibrary = async (
  registration: IRegistration,
  newRegistration: IRegistration,
  event: IEventDetails
) => {
  const ownedRegistrations = await Api.get(
    `/registrations?event_id=${event.event_id}`
  );
  const currentRegistration = ownedRegistrations.find(
    (it: IRegistration) => it.event_id === event.event_id
  );

  if (
    currentRegistration &&
    currentRegistration.registration_id !== registration.registration_id
  ) {
    await Api.delete(
      `/registrations?registration_id=${currentRegistration.registration_id}`
    );
  }

  await Api.post(EntryPoints.REGISTRATIONS, newRegistration);
};

const setFacilityFromLibrary = async (
  facility: IFacility,
  newFacility: IFacility
) => {
  const facilityFieds = await Api.get(
    `/fields?facilities_id=${facility.facilities_id}`
  );

  const mappedFieldsWithNewId = facilityFieds.map((it: IField) => ({
    ...it,
    field_id: getVarcharEight(),
    facilities_id: newFacility.facilities_id,
  }));

  await Api.post(EntryPoints.FACILITIES, newFacility);

  await Promise.all(
    mappedFieldsWithNewId.map((it: IField) => Api.post('/fields', it))
  );
};

const SetFormLibraryManager = {
  setFacilityFromLibrary,
  setRegistrationFromLibrary,
};

export {
  generateEntityId,
  getClearScharedItem,
  checkAleadyExist,
  SetFormLibraryManager,
};
