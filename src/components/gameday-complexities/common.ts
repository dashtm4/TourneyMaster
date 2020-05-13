import ITimeSlot from 'common/models/schedule/timeSlots';

export enum OptionsEnum {
  'Cancel Games' = 'cancel_games',
  'Weather Interruption: Modify Game Timeslots' = 'weather_interruption_modify_game_timeslots',
}

export enum TypeOptionsEnum {
  'cancel_games' = 'Cancel Games',
  'weather_interruption_modify_game_timeslots' = 'Weather Interruption: Modify Game Timeslots',
}
export interface IComplexityTimeslot {
  eventId: string;
  eventDays: string;
  eventTimeSlots: ITimeSlot[];
  isLoading: boolean;
  isLoaded: boolean;
}

export type IComplexityTimeslots = {
  [key: string]: IComplexityTimeslot;
};
