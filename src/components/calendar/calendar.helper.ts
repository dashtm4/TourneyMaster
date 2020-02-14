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
