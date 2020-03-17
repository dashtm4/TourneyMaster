export const mapFacilitiesToOptions = (
  allFacilities: any,
  facilitiesImpacted: any
) => {
  const facilities = JSON.parse(facilitiesImpacted);
  return allFacilities
    .filter((fac: any) => facilities && facilities.includes(fac.facilities_id))
    .map((fac: any) => ({
      label: fac.facilities_description,
      value: fac.facilities_id,
    }));
};

export const mapFieldsToOptions = (allFields: any, fieldsImpacted: any) => {
  const fields = JSON.parse(fieldsImpacted);
  return allFields
    .filter((field: any) => fields && fields.includes(field.field_id))
    .map((field: any) => ({
      label: field.field_name,
      value: field.field_id,
    }));
};

export const mapTimeslotsToOptions = (timeslots: any) => {
  const parsedTimeslots = JSON.parse(timeslots);
  return parsedTimeslots.map((timeslot: any) => ({
    label: timeslot,
    value: timeslot,
  }));
};

export const getFacilitiesOptionsForEvent = (
  facilities: any,
  eventId: string
) => {
  return facilities
    .filter((facility: any) => facility.event_id === eventId)
    .map((facility: any) => ({
      label: facility.facilities_description,
      value: facility.facilities_id,
    }));
};

export const getFieldsOptionsForFacilities = (fields: any, facilities: any) => {
  return fields
    .filter((field: any) =>
      facilities
        .map((fac: { label: string; value: string }) => fac.value)
        .includes(field.facilities_id)
    )
    .map((field: any) => ({ label: field.field_name, value: field.field_id }));
};
