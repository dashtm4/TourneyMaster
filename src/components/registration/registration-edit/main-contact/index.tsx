import React from 'react';
import styles from '../styles.module.scss';
import { Input, Select, Checkbox } from 'components/common';

const MainContact = ({ data, onChange }: any) => {
  const roles = ['1', '2', '3'];

  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('reg_first_name', e.target.value);
  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('reg_last_name', e.target.value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('email_address', e.target.value);

  const onMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('mobile_number', e.target.value);

  const onPermissionToTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('permission_to_text', e.target.checked ? 1 : 0);

  const onRoleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('role', e.target.value);

  return (
    <div className={styles.section}>
      <div className={styles.sectionFirstRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First"
            value={data.reg_first_name || ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last"
            value={data.reg_last_name || ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            label="Role"
            options={roles.map(type => ({
              label: type,
              value: type,
            }))}
            value=""
            onChange={onRoleChange}
          />
          <span className={styles.tournamentStatus} />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Email"
            value={data.email_address || ''}
            onChange={onEmailChange}
          />
        </div>
      </div>
      <div className={styles.sectionSecondRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Mobile Number"
            type="number"
            value={data.mobile_number || ''}
            onChange={onMobileNumberChange}
          />
        </div>
        <div className={styles.sectionItem} style={{ marginTop: '20px' }}>
          <Checkbox
            formLabel=""
            options={[
              {
                label: 'Permission to Text',
                checked: Boolean(data.permission_to_text),
              },
            ]}
            onChange={onPermissionToTextChange}
          />
        </div>
        <div className={styles.sectionItem} />
        <div className={styles.sectionItem} />
      </div>
    </div>
  );
};

export default MainContact;
