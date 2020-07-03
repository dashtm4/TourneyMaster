import { ScheduleCreationType } from 'common/models';

const getScheduleCreationTypeOptions = () =>
  Object.keys(ScheduleCreationType)
    .map((k: string) => mapScheduleCreationTypeToOption(ScheduleCreationType[k]))
    .filter(o => o);

const mapScheduleCreationTypeToOption = (t: ScheduleCreationType) => {
  switch (t) {
    case ScheduleCreationType.Manually:
      return 'Create Manually';
    case ScheduleCreationType.VisualGamesMaker:
      return 'Use Visual Games Maker';
    case ScheduleCreationType.Scheduler:
      return 'Use Scheduler';
    default:
      return '';
  }
};

const mapScheduleCreationOptionToType = (o: string): ScheduleCreationType => {
  switch (o) {
    case 'Create Manually':
      return ScheduleCreationType.Manually;
    case 'Use Visual Games Maker':
      return ScheduleCreationType.VisualGamesMaker;
    case 'Use Scheduler':
    default:
      return ScheduleCreationType.Scheduler;
  }
};

export {
  getScheduleCreationTypeOptions,
  mapScheduleCreationTypeToOption,
  mapScheduleCreationOptionToType,
  ScheduleCreationType,
};
