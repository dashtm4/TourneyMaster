import React from 'react';
import styles from '../../styles.module.scss';
import { Input, Checkbox } from 'components/common';
import { BindingCbWithTwo } from 'common/models';

interface IRegistrantNameProps {
  data: any;
  onChange: BindingCbWithTwo<string, string | number>;
}

const RegistrantName = ({ data, onChange }: IRegistrantNameProps) => {
  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_first_name', e.target.value);

  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_last_name', e.target.value);

  const onPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_mobile', e.target.value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_email', e.target.value);

  const onIsParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('registrant_is_the_participant', Number(e.target.checked));

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First Name"
            value={data.registrant_first_name || ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last Name"
            value={data.registrant_last_name || ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Email"
            value={data.registrant_email || ''}
            onChange={onEmailChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Phone Number"
            value={data.registrant_mobile || ''}
            onChange={onPhoneNumberChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onIsParticipantChange}
            options={[
              {
                label: 'Registrant is participant',
                checked: Boolean(
                  data ? data.registrant_is_the_participant : false
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrantName;
