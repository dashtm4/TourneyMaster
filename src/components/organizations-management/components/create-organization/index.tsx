import React from 'react';

import {
  SectionDropdown,
  Button,
  Input,
  CardMessage,
  HeadingLevelThree,
  PopupConfirm,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { IConfigurableOrganization, BindingCbWithOne } from 'common/models';
import styles from './styles.module.scss';

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
  createOrganization: (organizationData: IConfigurableOrganization) => void;
  index: number;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
}

const CreateOrganization = ({
  createOrganization,
  expanded,
  onToggleOne,
  index,
}: Props) => {
  const [organization, onChange] = React.useState<IConfigurableOrganization>(
    EMPTY_ORGANIZATION
  );
  const [isOpenConfirmPopup, onConfirmPopup] = React.useState(false);

  const onSectionToggle = () => {
    onToggleOne(index);
  };

  return (
    <>
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={false}
        panelDetailsType="flat"
        expanded={expanded}
        onToggle={onSectionToggle}
      >
        <HeadingLevelThree>
          <span>Create Organization</span>
        </HeadingLevelThree>
        <div className={styles.section}>
          <CardMessage
            type={CardMessageTypes.EMODJI_OBJECTS}
            style={CARD_MESSAGE_STYLES}
          >
            Create a common calendar where you and your organization’s
            collaborators can see each others notes, requests, tasks, and
            reminders.
          </CardMessage>
          <form
            onSubmit={(evt: any) => {
              evt.preventDefault();

              onConfirmPopup(true);
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
                label="Create Organization"
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
          createOrganization(organization);
          onConfirmPopup(false);
        }}
      />
    </>
  );
};

export default CreateOrganization;
