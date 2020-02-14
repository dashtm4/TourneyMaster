import { ICalendarEvent, IEvent } from 'common/models/calendar';
import { format } from 'date-fns';

export type ViewType = 'day' | 'week' | 'month';
type ButtonVariantType = 'squared' | 'squaredOutlined' | undefined;
export type ButtonTypeEvent = 'event' | 'reminder' | 'task';

export const getViewType = (view: 'day' | 'week' | 'month') => {
  switch (view) {
    case 'day':
      return 'timeGridDay';
    case 'week':
      return 'dayGridWeek';
    default:
      return 'dayGridMonth';
  }
};

export const buttonTypeView = (
  currentType: ViewType,
  currentView: ViewType
): ButtonVariantType =>
  currentView === currentType ? 'squared' : 'squaredOutlined';

export const buttonTypeEvent = (
  type: ButtonTypeEvent,
  currentType: ButtonTypeEvent
) => (type === currentType ? 'squared' : 'squaredOutlined');

export const appropriateEvents = (events: ICalendarEvent[]): IEvent[] => {
  console.log('events', events);

  const formatDate = (eventDate: string, eventTime: string) => {
    const date = new Date(eventDate);
    const time = new Date(eventTime);
    const timeH = format(time, 'HH');
    const timeM = format(time, 'mm');

    return format(new Date(date), `yyyy-MM-dd'T'${timeH}:${timeM}:00`);
  };

  const eventTypeToCalendar = (event: ICalendarEvent): IEvent => ({
    title: event.title,
    start: formatDate(event.dateFrom, event.timeFrom),
    end: formatDate(event.dateTo, event.timeTo),
    className: event.type,
  });

  return events.map(eventTypeToCalendar);
};
