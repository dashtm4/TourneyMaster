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

export const calculateDialogPosition = (left: number, top: number) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const containerWidth = 600;
  const containerHeight = 268;

  const leftMiddlePositive = left + containerWidth / 2;
  const leftMiddleNevagite = left - containerWidth / 2;

  const leftPosition =
    leftMiddlePositive > windowWidth
      ? windowWidth - containerWidth
      : leftMiddleNevagite;

  const topMiddlePositive = top + containerHeight / 2;
  const topMiddleNegative = top - containerHeight;
  const topWindowNegative = windowHeight - containerHeight;
  const minTopPosition = 90;

  const topPosition =
    topMiddlePositive > windowHeight
      ? topWindowNegative
      : top < containerHeight
      ? minTopPosition
      : topMiddleNegative;

  return { leftPosition, topPosition };
};

export const setBlankNewEvent = (date?: string): ICalendarEvent => ({
  title: 'New Event',
  dateFrom: date || new Date().toISOString(),
  dateTo: date || new Date().toISOString(),
  location: '',
  eventTag: '',
  type: 'event',
  timeFrom: new Date().toISOString(),
  timeTo: new Date().toISOString(),
  description: '',
  setReminder: false,
});
