import { ICalendarEvent, IEvent } from 'common/models/calendar';
// import { format } from 'date-fns';

export type ViewType = 'day' | 'week' | 'month' | 'listDay' | 'listMonth';
type ButtonVariantType = 'squared' | 'squaredOutlined' | undefined;
export type ButtonTypeEvent = 'event' | 'reminder' | 'task';

export const getViewType = (
  view: 'day' | 'week' | 'month' | 'listDay' | 'listMonth'
) => {
  switch (view) {
    case 'day':
      return 'timeGridDay';
    case 'week':
      return 'timeGridWeek';
    case 'listDay':
      return 'listDay';
    case 'listMonth':
      return 'listMonth';
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

export const appropriateEvents = (
  events: Partial<ICalendarEvent>[]
): IEvent[] => {
  // const formatDate = (eventDate: string) => {
  //   const date = new Date(eventDate);

  //   return format(new Date(date), `yyyy-MM-dd'T'HH:mm:ss`);
  // };

  const eventTypeToCalendar = (event: Partial<ICalendarEvent>): IEvent => ({
    id: event.cal_event_id!,
    title: event.cal_event_title!,
    start: new Date(event.cal_event_startdate!).toISOString(),
    end: new Date(event.cal_event_enddate!).toISOString(),
    className: event.cal_event_type,
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

export const setBlankNewEvent = (date?: string): Partial<ICalendarEvent> => ({
  cal_event_title: 'New Event',
  cal_event_startdate: date || new Date().toISOString(),
  cal_event_enddate: date || new Date().toISOString(),
  cal_event_tag: '',
  cal_event_type: 'event',
  cal_event_desc: '',
  has_reminder_YN: 0,
});
