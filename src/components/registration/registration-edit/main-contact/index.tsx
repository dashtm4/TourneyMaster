import React from 'react';
import styles from '../styles.module.scss';
import { Input, Checkbox, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { BindingCbWithTwo } from 'common/models';
import { IRegistration } from 'common/models/registration';

interface IMainContactProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string | number>;
}

const MainContact = ({ data, onChange }: IMainContactProps) => {
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
      <div className={styles.sectionTooltipRow}>
        <div className={styles.sectionItem} style={{ width: '51.5%' }} />
        <CardMessage
          type={CardMessageTypes.EMODJI_OBJECTS}
          style={{ fontSize: '10xp' }}
        >
          Admin, Tourney Director, Boys Lead, etc.
        </CardMessage>
      </div>
      <div className={styles.sectionFirstRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First"
            value={data ? data.reg_first_name : ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last"
            value={data ? data.reg_last_name : ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            label="Role"
            value={data ? data.role : ''}
            onChange={onRoleChange}
          />
          <span className={styles.tournamentStatus} />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Email"
            value={data ? data.email_address : ''}
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
            value={data ? data.mobile_number : ''}
            onChange={onMobileNumberChange}
          />
        </div>
        <div className={styles.sectionItem} style={{ marginTop: '20px' }}>
          <Checkbox
            formLabel=""
            options={[
              {
                label: 'Permission to Text',
                checked: data ? Boolean(data.permission_to_text) : Boolean(0),
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
