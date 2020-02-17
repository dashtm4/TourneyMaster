import { ICalendarEvent } from 'common/models/calendar';

export const isCalendarEventValid = (event: ICalendarEvent) => {
  const requiredFields = [
    'title',
    'location',
    'eventTag',
    'dateFrom',
    'dateTo',
  ];

  const fields = Object.keys(event).filter(
    (field: string) =>
      requiredFields.includes(field) &&
      event[field] !== undefined &&
      event[field] !== ''
  );

  return fields.length === requiredFields.length;
};
