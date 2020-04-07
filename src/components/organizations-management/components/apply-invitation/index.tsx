import React from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Button,
} from 'components/common';
import styles from './styles.module.scss';
import { BindingCbWithOne, BindingAction } from 'common/models';

interface Props {
  addUserToOrganization: (invCode: string) => void;
  index: number;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
  type?: string;
  onCancel?: BindingAction;
}

const ApplyInvitation = ({
  addUserToOrganization,
  expanded,
  onToggleOne,
  index,
  type,
  onCancel,
}: Props) => {
  const [invCode, onChange] = React.useState('');

  const onSectionToggle = () => {
    onToggleOne(index);
  };

  const onApplyInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();

    addUserToOrganization(invCode);

    onChange('');
  };

  const renderBtn = () => {
    return (
      <Button
        label="Apply Invitation"
        variant="contained"
        color="primary"
        disabled={!invCode}
        onClick={onApplyInvitation}
      />
    );
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
        {type !== 'wizard' && renderBtn()}
      </div>
      <form className={styles.section}>
        {type === 'wizard' && (
          <p className={styles.wMessage}>
            Ask your friend/coworker to give you the Organization code and apply
            it in the form below
          </p>
        )}
        <div className={styles.sectionItem}>
          <Input
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              onChange(evt.target.value)
            }
            value={invCode || ''}
            fullWidth={true}
            label="Organization Code"
          />
        </div>
        {type === 'wizard' && (
          <div className={styles.wBtnsWrapper}>
            <Button
              label="Cancel"
              variant="text"
              color="secondary"
              onClick={onCancel}
            />
            {renderBtn()}
          </div>
        )}
      </form>
    </SectionDropdown>
  );
};

export default ApplyInvitation;
