/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import styles from '../../styles.module.scss';
import { Input } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { ITeamsRegister } from 'common/models/register';

interface ICoachInfoProps {
  data: Partial<ITeamsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
  fillCoachInfo: any;
}

const CoachInfo = ({ data, onChange, fillCoachInfo }: ICoachInfoProps) => {
  useEffect(() => {
    if (data.contact_is_also_the_coach) {
      const info = {
        coach_first_name: data.contact_first_name,
        coach_last_name: data.contact_last_name,
        coach_mobile: data.contact_mobile,
        coach_email: data.contact_email,
      };
      fillCoachInfo(info);
    }
  }, []);
  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('coach_first_name', e.target.value);

  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('coach_last_name', e.target.value);

  const onPhoneNumberChange = (value: string) =>
    onChange('coach_mobile', value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('coach_email', e.target.value);

  const onAdditionalEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('additional_emails', e.target.value);

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First Name"
            value={data.coach_first_name || ''}
            onChange={onFirstNameChange}
            isRequired={true}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last Name"
            value={data.coach_last_name || ''}
            onChange={onLastNameChange}
            isRequired={true}
          />
        </div>
        <div className={styles.emailSectionItem}>
          <span className={styles.label}>Email *</span>
          <ValidatorForm onSubmit={() => { }}>
            <TextValidator
              onChange={onEmailChange}
              value={data.coach_email || ''}
              name="email"
              validators={['required', 'isEmail']}
              errorMessages={['this field is required', 'email is not valid']}
            />
          </ValidatorForm>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.sectionTitle}>Phone Number CA</div>
          <PhoneInput
            country={'us'}
            // disableDropdown
            onlyCountries={['us', 'ca']}
            disableCountryCode={false}
            placeholder=""
            value={data.coach_mobile || ''}
            onChange={onPhoneNumberChange}
            containerStyle={{ marginTop: '7px' }}
            inputStyle={{
              height: '40px',
              fontSize: '18px',
              color: '#6a6a6a',
              borderRadius: '4px',
              width: '100%',
            }}
            inputProps={{
              required: true,
              minLength: 14,
            }}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Additional Emails"
            value={data.additional_emails || ''}
            onChange={onAdditionalEmailsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachInfo;
