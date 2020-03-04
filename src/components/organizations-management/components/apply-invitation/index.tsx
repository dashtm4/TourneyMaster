import React from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Button,
} from 'components/common';
import { addUserToOrganization } from '../../logic/actions';
import styles from './styles.module.scss';

const ApplyInvitation = () => {
  const [invCode, onChange] = React.useState('');

  return (
    <SectionDropdown
      type="section"
      useBorder={true}
      isDefaultExpanded={false}
      panelDetailsType="flat"
    >
      <HeadingLevelThree>
        <span>Apply Invitation</span>
      </HeadingLevelThree>
      <form
        onSubmit={evt => {
          evt.preventDefault();

          addUserToOrganization({ invCode });
        }}
        className={styles.section}
      >
        <div className={styles.sectionItem}>
          <Input
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              onChange(evt.target.value)
            }
            value={invCode || ''}
            fullWidth={true}
            label="Invitation Code"
          />
        </div>
        <div className={styles.sectionItem}>
          <Button
            label="Apply Invitation"
            variant="contained"
            color="primary"
            btnType="submit"
          />
        </div>
      </form>
    </SectionDropdown>
  );
};

export default ApplyInvitation;
