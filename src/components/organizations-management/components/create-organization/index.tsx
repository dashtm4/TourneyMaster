import React from 'react';
import {
  SectionDropdown,
  Button,
  Input,
  CardMessage,
  HeadingLevelThree,
} from 'components/common';
import { Icons } from 'common/constants';
import styles from './styles.module.scss';
import { IConfigurableOrganization } from 'common/models';

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

  return (
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
          onSubmit={evt => {
            evt.preventDefault();

            addOrganization(organization);
          }}
        >
          <div className={styles.sectionItem}>
            <Input
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
  );
};

export default CreateOrganization;
