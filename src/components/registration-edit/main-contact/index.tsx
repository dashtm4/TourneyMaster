import React from 'react';
import styles from '../styles.module.scss';
import { Input, Select, Checkbox } from 'components/common';

const MainContact = ({ onChange }: any) => {
  const roles = ['Role1', 'Role2', 'Role3'];

  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('first_name', e.target.value);
  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('last_name', e.target.value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('email', e.target.value);

  const onMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('mobile_number', e.target.value);

  const onPermissionToTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('permission_to_text', e.target.checked);

  return (
    <div className={styles.section}>
      <div className={styles['section-first-row']}>
        <div className={styles['section-item']}>
          <Input
            width="161px"
            label="First"
            // value={data.first_name || ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles['section-item']}>
          <Input
            width="161px"
            label="Last"
            // value={data.last_name || ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles['section-item']}>
          <span className={styles['section-title']}>Role</span>
          <Select
            width="161px"
            label=""
            options={roles}
            value=""
            // onChange={onChangeMaxTeamNumber}
          />
          <span className={styles['tournament-status']} />
        </div>
        <div className={styles['section-item']}>
          <Input
            width="161px"
            label="Email"
            // value={data.email || ''}
            onChange={onEmailChange}
          />
        </div>
      </div>
      <div className={styles['section-second-row']}>
        <div className={styles['section-item']}>
          <Input
            width="161px"
            label="Mobile Number"
            type="number"
            // value={data.mobile_number || ''}
            onChange={onMobileNumberChange}
          />
        </div>
        <div className={styles['section-item']} style={{ marginTop: '20px' }}>
          <Checkbox
            formLabel=""
            options={[{ label: 'Permission to Text', checked: Boolean(0) }]}
            onChange={onPermissionToTextChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContact;
