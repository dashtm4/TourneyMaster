import React from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Button,
} from 'components/common';
import styles from './styles.module.scss';
import { BindingCbWithOne } from 'common/models';

interface Props {
  addUserToOrganization: (invCode: string) => void;
  index: number;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
}

const ApplyInvitation = ({
  addUserToOrganization,
  expanded,
  onToggleOne,
  index,
}: Props) => {
  const [invCode, onChange] = React.useState('');

  const onSectionToggle = () => {
    onToggleOne(index);
  };

  const onApplyInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    addUserToOrganization(invCode);
  };

  return (
    <SectionDropdown
      type="section"
      useBorder={true}
      isDefaultExpanded={false}
      panelDetailsType="flat"
      expanded={expanded}
      onToggle={onSectionToggle}
    >
      <div className={styles.headingContainer}>
        <HeadingLevelThree>
          <span>Apply Invitation</span>
        </HeadingLevelThree>
        <Button
          label="Apply Invitation"
          variant="contained"
          color="primary"
          disabled={!invCode}
          onClick={onApplyInvitation}
        />
      </div>
      <form className={styles.section}>
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
      </form>
    </SectionDropdown>
  );
};

export default ApplyInvitation;
