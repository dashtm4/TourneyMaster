import * as Yup from 'yup';

const teamSchema = Yup.object({
  long_name: Yup.string().required('Team Long Name is required to fill!'),
  //  short_name: Yup.string().required('Team short name is required to fill!'),
  division_id: Yup.string().required('Division is required to fill!'),
  phone_num: Yup.string()
    .nullable()
    .required(
      'Phone numbers of the coaches are required for the printed schedules, so leaving it empty hurts you in the long term. Do yourself a favor and please enter their mobile numbers.'
    ),

  //  phone_num: Yup.string().matches(
  //   /^\+?[1-9]\d{1,14}$/,
  //  'Invalid format for phone number'
  //  ),
});

export { teamSchema };
