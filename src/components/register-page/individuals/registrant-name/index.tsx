import React from 'react';
import styles from '../../styles.module.scss';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Input, Checkbox } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { IIndividualsRegister } from 'common/models/register';

interface IRegistrantNameProps {
  data: Partial<IIndividualsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
}

const RegistrantName = ({ data, onChange }: IRegistrantNameProps) => {
  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_first_name', e.target.value);

  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_last_name', e.target.value);

  const onPhoneNumberChange = (value: string) =>
    onChange('registrant_mobile', value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_email', e.target.value);

  const onIsParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('registrant_is_the_participant', Number(e.target.checked));
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First Name"
            value={data.registrant_first_name || ''}
            onChange={onFirstNameChange}
            isRequired={true}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last Name"
            value={data.registrant_last_name || ''}
            isRequired={true}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.emailSectionItem}>
          <span className={styles.label}>Email *</span>
          <ValidatorForm onSubmit={() => { }}>
            <TextValidator
              onChange={onEmailChange}
              value={data.registrant_email || ''}
              name="email"
              validators={['required', 'isEmail']}
              errorMessages={['this field is required', 'email is not valid']}
            />
          </ValidatorForm>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.sectionTitle}>Phone Number</div>
          <PhoneInput
            country={'us'}
            // disableDropdown
            onlyCountries={['us', 'ca']}
            disableCountryCode={false}
            placeholder=""
            value={data.registrant_mobile || ''}
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
        <Checkbox
          onChange={onIsParticipantChange}
          options={[
            {
              label: 'Registrant is the Player',
              checked: Boolean(data.registrant_is_the_participant || false),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RegistrantName;
