import React from 'react';
import { HeadingLevelThree, SectionDropdown, Input } from 'components/common';
import { MenuTitles } from 'common/enums';
import styles from './styles.module.scss';

const EditProfile = () => (
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
        <Input value="" label="User name" fullWidth={true} />
      </fieldset>
      <fieldset className={styles.inputWrapper}>
        <Input value="" label="User name" fullWidth={true} />
      </fieldset>
      <fieldset className={styles.inputWrapper}>
        <Input value="" label="User tag" fullWidth={true} startAdornment="@" />
      </fieldset>
    </div>
  </SectionDropdown>
);

export default EditProfile;
