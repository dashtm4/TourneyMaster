import ITimeSlot from 'common/models/schedule/timeSlots';

export enum OptionsEnum {
  'Cancel Games' = 'cancel_games',
  'Close Fields & Move Games' = 'close_fields_and_move_games',
  'Modify Game & Subsequent TimeSlots' = 'modify_game_and_subsequent_timeslot',
}

export enum TypeOptionsEnum {
  'cancel_games' = 'Cancel Games',
  'close_fields_and_move_games' = 'Close Fields & Move Games',
  'modify_game_and_subsequent_timeslot' = 'Modify Game & Subsequent TimeSlots',
}
export interface IComplexityTimeslot {
  isLoading: boolean;
  isLoaded: boolean;
  eventTimeSlots: ITimeSlot[];
}

export type IComplexityTimeslots = {
  [key: string]: IComplexityTimeslot;
};
