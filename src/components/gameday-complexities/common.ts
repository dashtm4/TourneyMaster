import ITimeSlot from 'common/models/schedule/timeSlots';

export interface IComplexityTimeslot {
  isLoading: boolean;
  isLoaded: boolean;
  eventTimeSlots: ITimeSlot[];
}

export type IComplexityTimeslots = {
  [key: string]: IComplexityTimeslot;
};
