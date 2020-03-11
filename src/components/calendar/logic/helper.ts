import { ICalendarEvent } from 'common/models/calendar';

export const isCalendarEventValid = (event: Partial<ICalendarEvent>) => {
  const requiredFields = [
    'cal_event_title',
    // 'cal_event_startdate',
    // 'cal_event_enddate',
  ];

  const fields = Object.keys(event).filter(
    (field: string) =>
      requiredFields.includes(field) &&
      event[field] !== undefined &&
      event[field] !== ''
  );

  return fields.length === requiredFields.length;
};
