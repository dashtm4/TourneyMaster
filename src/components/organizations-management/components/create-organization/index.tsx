import React from 'react';
// import * as Yup from 'yup';
import {
  SectionDropdown,
  Button,
  Input,
  CardMessage,
  HeadingLevelThree,
  PopupConfirm,
} from 'components/common';
import { Icons } from 'common/constants';
import styles from './styles.module.scss';
import { IConfigurableOrganization } from 'common/models';

// const validationSchema = Yup.object().shape({
//   name: Yup.string()
//     .required('Email is required!')
//     .max(255, 'Max email length is 255 symbols!'),
// });

const CONFIRM_POPUP_MESSAGE =
  'You are about to create a new organization. Are you sure?';

const CARD_MESSAGE_STYLES = {
  marginBottom: '20px',
};

const EMPTY_ORGANIZATION = {
  org_name: '',
  org_tag: null,
  city: null,
  state: null,
};

interface Props {
  addOrganization: (organizationData: IConfigurableOrganization) => void;
}

const CreateOrganization = ({ addOrganization }: Props) => {
  const [organization, onChange] = React.useState<IConfigurableOrganization>(
    EMPTY_ORGANIZATION
  );
  const [isOpenConfirmPopup, onConfirmPopup] = React.useState(false);

  return (
    <>
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={false}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Create Organization</span>
        </HeadingLevelThree>
        <div className={styles.section}>
          <CardMessage type={Icons.EMODJI_OBJECTS} style={CARD_MESSAGE_STYLES}>
            Create a common calendar where you and your organization’s
            collaborators can see each others notes, requests, tasks, and
            reminders.
          </CardMessage>
          <form
            onSubmit={(evt: any) => {
              evt.preventDefault();

              console.log(Object.keys(new FormData(evt.formData)));

              // console.log(validationSchema.isValidSync({ name: '' }));

              // onConfirmPopup(true);
            }}
          >
            <div className={styles.sectionItem}>
              <Input
                name="orgName"
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ ...organization, org_name: evt.target.value })
                }
                value={organization.org_name || ''}
                fullWidth={true}
                label="Organization Name"
                isRequired
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                name="orgTag"
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ ...organization, org_tag: evt.target.value })
                }
                value={organization.org_tag || ''}
                label="Organization Tag"
                fullWidth={true}
                startAdornment="@"
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                name="city"
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ ...organization, city: evt.target.value })
                }
                value={organization.city || ''}
                label="City"
                fullWidth={true}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                name="state"
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({ ...organization, state: evt.target.value })
                }
                value={organization.state || ''}
                label="State"
                fullWidth={true}
              />
            </div>
            <div className={styles.sectionItem}>
              <Button
                label="Add Organization"
                btnType="submit"
                variant="contained"
                color="primary"
              />
            </div>
          </form>
        </div>
      </SectionDropdown>
      <PopupConfirm
        message={CONFIRM_POPUP_MESSAGE}
        isOpen={isOpenConfirmPopup}
        onClose={() => onConfirmPopup(false)}
        onCanceClick={() => onConfirmPopup(false)}
        onYesClick={() => {
          addOrganization(organization);
          onConfirmPopup(false);
          onChange(EMPTY_ORGANIZATION);
        }}
      />
    </>
  );
};

export default CreateOrganization;
