import * as Yup from 'yup';

const eventDetailsSchema = Yup.object({
  sport_id: Yup.string().required('Field "Sport" is required to fill!'),
  event_name: Yup.string().required('Event name is required to fill!'),
  event_description: Yup.string().required(
    'Event description is required to fill!'
  ),
  event_startdate: Yup.string().required(
    'Event start-date is required to fill!'
  ),
  event_enddate: Yup.string().required('Event end-date is required to fill!'),
  time_zone_utc: Yup.string().required('Event time zone is required to fill!'),
});

export { eventDetailsSchema };
