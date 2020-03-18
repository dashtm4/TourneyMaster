import * as Yup from 'yup';

const scheduleSchema = Yup.object({
  schedule_name: Yup.string().required('Schedule name is required to fill!'),
  schedule_tag: Yup.string().required('Schedule tag is required to fill!'),
  min_num_games: Yup.string().required(
    'Min num games Duration is required to fill!'
  ),
  max_num_games: Yup.string().required(
    'Max num games Duration is required to fill!'
  ),
  games_start_on: Yup.string().required(
    'Game start field is required to fill!'
  ),
  period_duration: Yup.string().required(
    'Period duration uration is required to fill!'
  ),
  time_btwn_periods: Yup.string().required(
    'Time between periods is required to fill!'
  ),
  periods_per_game: Yup.string().required('Time division is required to fill!'),
});

export { scheduleSchema };
