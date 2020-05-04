/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import styles from '../../styles.module.scss';
import { Input, Select, DatePicker } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import 'react-phone-input-2/lib/high-res.css';
import PhoneInput from 'react-phone-input-2';
import { IIndivisualsRegister } from 'common/models/register';

interface IPlayerInfoProps {
  data: Partial<IIndivisualsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
  fillParticipantInfo: any;
  divisions: { label: string; value: string }[];
}

const playerLevelOptions = [{ label: 'Level1', value: 'Level1' }];

const PlayerInfo = ({
  data,
  onChange,
  fillParticipantInfo,
  divisions,
}: IPlayerInfoProps) => {
  useEffect(() => {
    if (data.registrant_is_the_participant) {
      const info = {
        participant_first_name: data.registrant_first_name,
        participant_last_name: data.registrant_last_name,
        participant_mobile: data.registrant_mobile,
        participant_email: data.registrant_email,
      };
      fillParticipantInfo(info);
    }
  }, []);
  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('participant_first_name', e.target.value);

  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('participant_last_name', e.target.value);

  const onPhoneNumberChange = (value: string) =>
    onChange('participant_mobile', value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('participant_email', e.target.value);

  const onPlayerCityChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_city', e.target.value);

  const onPlayerStateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_state', e.target.value);

  const onDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('ext_sku', e.target.value);

  const onPlayerLevelSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_level', e.target.value);

  const onPlayerBirthdayChange = (e: Date | string) =>
    !isNaN(Number(e)) &&
    onChange('player_birthdate', new Date(e).toISOString());

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Participant First Name"
            value={data.participant_first_name || ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Participant Last Name"
            value={data.participant_last_name || ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Email"
            value={data.participant_email || ''}
            onChange={onEmailChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.sectionTitle}>Phone Number</div>
          <PhoneInput
            country={'us'}
            value={data.participant_mobile || ''}
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
          <Input
            fullWidth={true}
            label="City"
            value={data.player_city || ''}
            onChange={onPlayerCityChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="State"
            value={data.player_state || ''}
            onChange={onPlayerStateChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={divisions}
            label="Division"
            value={data.ext_sku || ''}
            onChange={onDivisionChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={playerLevelOptions}
            label="Player Level"
            value={data.player_level || ''}
            onChange={onPlayerLevelSelect}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Birthdate and Year"
            type="date"
            value={data.player_birthdate || new Date()}
            onChange={onPlayerBirthdayChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
