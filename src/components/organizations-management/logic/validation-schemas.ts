import * as Yup from 'yup';

const organizationSchema = Yup.object({
  org_name: Yup.string().required('Organization name is required to fill!'),
});

const applyInvitationSchema = Yup.object({
  org_id: Yup.string().required('Invitation Code is required to fill!'),
});

export { organizationSchema, applyInvitationSchema };
