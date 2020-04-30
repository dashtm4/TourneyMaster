import React from 'react';
import styles from '../../styles.module.scss';
import { Input, Checkbox } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { ITeamsRegister } from 'common/models/register';

interface IContacnInfoProps {
  data: Partial<ITeamsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
}

const ContacnInfo = ({ data, onChange }: IContacnInfoProps) => {
  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('contact_first_name', e.target.value);

  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('contact_last_name', e.target.value);

  const onPhoneNumberChange = (value: string) =>
    onChange('contact_mobile', value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('contact_email', e.target.value);

  const onIsCoachChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('contact_is_also_the_coach', Number(e.target.checked));
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First Name"
            value={data.contact_first_name || ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last Name"
            value={data.contact_last_name || ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Email"
            value={data.contact_email || ''}
            onChange={onEmailChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.sectionTitle}>Phone Number</div>
          <PhoneInput
            country={'us'}
            value={data.contact_mobile || ''}
            onChange={onPhoneNumberChange}
            containerStyle={{ marginTop: '7px' }}
            inputStyle={{
              height: '40px',
              fontSize: '18px',
              color: '#6a6a6a',
              borderRadius: '4px',
              width: '100%',
            }}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onIsCoachChange}
            options={[
              {
                label: 'Contact is the Coach',
                checked: Boolean(data.contact_is_also_the_coach || false),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ContacnInfo;
