import { IFacility, IField, IEventDetails } from 'common/models';
import { IMultiSelectOption } from 'components/common/multi-select';
import { sortByField, formatTimeSlot } from 'helpers';
import { SortByFilesTypes } from 'common/enums';
import { IComplexityTimeslot } from '../common';

export const mapFacilitiesToOptions = (
  allFacilities: IFacility[],
  facilitiesImpacted: string
) => {
  const facilities = JSON.parse(facilitiesImpacted);
  return allFacilities
    .filter(fac => facilities && facilities.includes(fac.facilities_id))
    .map(fac => ({
      label: fac.facilities_description,
      value: fac.facilities_id,
    }));
};

export const mapFieldsToOptions = (
  allFields: IField[],
  fieldsImpacted: string
) => {
  const fields = JSON.parse(fieldsImpacted);
  return allFields
    .filter(field => fields && fields.includes(field.field_id))
    .map(field => ({
      label: field.field_name,
      value: field.field_id,
      checked: true,
    }));
};

export const mapTimeslotsToOptions = (
  timeslots: string,
  backupType: string
) => {
  switch (backupType) {
    case 'cancel_games': {
      const parsedTimeslots = JSON.parse(timeslots);
      return parsedTimeslots.map((timeslot: string) => ({
        label: timeslot,
        value: timeslot,
      }));
    }
    case 'modify_start_time':
    case 'modify_game_lengths':
      return timeslots;
    default:
      return [{ label: 'default', value: 'default' }];
  }
};

export const getEventOptions = (events: IEventDetails[]) => {
  const eventOptions = events.map(event => ({
    label: event.event_name,
    value: event.event_id,
  }));

  const sortedEventOptions = sortByField(eventOptions, SortByFilesTypes.SELECT);

  return sortedEventOptions;
};

export const getFacilitiesOptionsForEvent = (
  facilities: IFacility[],
  eventId: string
) => {
  const facilityOptions = facilities
    .filter(facility => facility.event_id === eventId)
    .map(facility => ({
      label: facility.facilities_description,
      value: facility.facilities_id,
    }));

  const sortedFacilityOptions = sortByField(
    facilityOptions,
    SortByFilesTypes.SELECT
  );

  return sortedFacilityOptions;
};

export const getFieldsOptionsForFacilities = (
  fields: IField[],
  facilitiesOptions: IMultiSelectOption[],
  fieldOptions: IMultiSelectOption[] | undefined
) => {
  const fieldOptionsForFacilities = facilitiesOptions.reduce((acc, option) => {
    const fieldsByFacilityId = fields.filter(
      field => field.facilities_id === option.value
    );

    const options = fieldsByFacilityId.map(field => ({
      label: `${field.field_name} (${option.label})`,
      value: field.field_id,
      checked: fieldOptions
        ? fieldOptions.some(
            it => it.value === field.field_id && Boolean(it.checked)
          )
        : false,
    }));

    return [...acc, ...options];
  }, [] as IMultiSelectOption[]);

  const sortedFieldOptions = sortByField(
    fieldOptionsForFacilities,
    SortByFilesTypes.SELECT
  );

  return sortedFieldOptions;
};

export const stringifyBackupPlan = (backupPlan: any) => {
  return {
    ...backupPlan,
    facilities_impacted: JSON.stringify(
      backupPlan.facilities_impacted.map((fac: any) => fac.value)
    ),
    fields_impacted: JSON.stringify(
      backupPlan.fields_impacted.map((field: any) => field.value)
    ),
    timeslots_impacted:
      backupPlan.backup_type === 'cancel_games'
        ? JSON.stringify(
            backupPlan.timeslots_impacted.map((timeslot: any) => timeslot.value)
          )
        : backupPlan.timeslots_impacted,
  };
};

export const getTimeSlotOptions = (timeSlots: IComplexityTimeslot) => {
  if (!timeSlots.eventTimeSlots) {
    return [];
  }

  const timeSlotOptions = timeSlots.eventTimeSlots.map(it => ({
    value: it.time,
    label: formatTimeSlot(it.time) as string,
  }));

  return timeSlotOptions;
};
