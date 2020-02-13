export type ViewType = 'day' | 'week' | 'month';
type buttonVariantType = 'squared' | 'squaredOutlined' | undefined;

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
): buttonVariantType =>
  currentView === currentType ? 'squared' : 'squaredOutlined';
