import React from 'react';
import { HeadingLevelThree, SectionDropdown, Input } from 'components/common';
import { MenuTitles } from 'common/enums';
import { IMember, BindingCbWithOne } from 'common/models';
import { IUtilitiesMember } from '../../types';
import styles from './styles.module.scss';

enum FormFields {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  MEMBER_TAG = 'member_tag',
}

interface Props {
  userData: IMember | IUtilitiesMember;
  changeUser: BindingCbWithOne<Partial<IMember | IUtilitiesMember>>;
}

const EditProfile = ({ userData, changeUser }: Props) => (
  <SectionDropdown
    id={MenuTitles.EDIT_PROFILE}
    type="section"
    panelDetailsType="flat"
    isDefaultExpanded={true}
  >
    <HeadingLevelThree>
      <span className={styles.detailsSubtitle}>{MenuTitles.EDIT_PROFILE}</span>
    </HeadingLevelThree>
    <div className={styles.editProfileForm}>
      <fieldset className={styles.inputWrapper}>
        <Input
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            changeUser({ [FormFields.FIRST_NAME]: evt.target.value })
          }
          value={userData.first_name || ''}
          label="First name"
          fullWidth={true}
        />
      </fieldset>
      <fieldset className={styles.inputWrapper}>
        <Input
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            changeUser({ [FormFields.LAST_NAME]: evt.target.value })
          }
          value={userData.last_name || ''}
          label="Last name"
          fullWidth={true}
        />
      </fieldset>
      <fieldset className={styles.inputWrapper}>
        <Input
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            changeUser({ [FormFields.MEMBER_TAG]: evt.target.value })
          }
          value={userData.member_tag || ''}
          label="User tag"
          fullWidth={true}
          startAdornment="@"
        />
      </fieldset>
    </div>
  </SectionDropdown>
);

export default EditProfile;
