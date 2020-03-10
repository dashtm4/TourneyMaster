import * as Yup from 'yup';

const teamSchema = Yup.object({
  long_name: Yup.string().required('Team long name is required to fill!'),
  short_name: Yup.string().required('Team short name is required to fill!'),
});

export { teamSchema };
