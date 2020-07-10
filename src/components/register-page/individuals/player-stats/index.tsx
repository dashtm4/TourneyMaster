import React from 'react';
import { IIndividualsRegister } from 'common/models/register';
import { Input, Select, CardMessage } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import { CardMessageTypes } from 'components/common/card-message/types';
import styles from '../../styles.module.scss';

interface IPlayerStatsProps {
  data: Partial<IIndividualsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
  jerseyNumberRequired: boolean;
}

const dominantHandOptions = [
  { label: 'Right', value: 'Right' },
  { label: 'Left', value: 'Left' },
];
const sizeOptions = [
  { label: 'XL', value: 'XL' },
  { label: 'L', value: 'L' },
  { label: 'M', value: 'M' },
  { label: 'S', value: 'S' },
  { label: 'YL', value: 'YL' },
  { label: 'YM', value: 'YM' },
  { label: 'YS', value: 'YS' },
];
const position = [
  { label: 'Attack', value: 'Attack' },
  { label: 'Attack/Middie', value: 'Attack/Middie' },
  { label: 'Middie', value: 'Middie' },
  { label: 'Defense', value: 'Defense' },
  { label: 'Fogo', value: 'Fogo' },
  { label: 'Goalie', value: 'Goalie' },
  { label: 'LSM', value: 'LSM' },
  { label: 'Other', value: 'Other' },

]

const heightFeetOptions = [
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];
const heightInchesOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
];

const PlayerStats = ({ data, onChange, jerseyNumberRequired }: IPlayerStatsProps) => {
  const onClubNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_club_name', e.target.value);

  const onClubCoachNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_club_coach_name', e.target.value);

  const onHighlightUrlChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_highlight_URL', e.target.value);

  const onSchoolAttendingChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('school_attending', e.target.value);

  const onDominantHandChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('dominant_hand', e.target.value);

  const onHeightFeetChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('height_feet', e.target.value);

  const onHeightInchesChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('height_inches', e.target.value);

  const onShortSizeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('short_size', e.target.value);

  const onShirtSizeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('shirt_size', e.target.value);

  const onPositionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('position', e.target.value);

  const onGraduationYearChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('hs_graduation_year', e.target.value);

  const onGPAChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('gpa', e.target.value);

  const onJerseyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('jersey_number', e.target.value);

  const onInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_instagram', e.target.value);

  const onSportRecruitsUrlChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_sportrecruits_url', e.target.value);

  const onConnectLaxUrlChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('player_connectlax_url', e.target.value);

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Club Name"
            value={data.player_club_name || ''}
            onChange={onClubNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Club Head Coach Name"
            value={data.player_club_coach_name || ''}
            onChange={onClubCoachNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="High School"
            value={data.school_attending || ''}
            onChange={onSchoolAttendingChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={dominantHandOptions}
            label="Dominant Hand"
            value={data.dominant_hand || ''}
            onChange={onDominantHandChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Select
            options={heightFeetOptions}
            label="Height (Feet)"
            value={data.height_feet || ''}
            onChange={onHeightFeetChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={heightInchesOptions}
            label="Height (Inches)"
            value={data.height_inches || ''}
            onChange={onHeightInchesChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={sizeOptions}
            label="Short Size"
            value={data.short_size || ''}
            onChange={onShortSizeChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={sizeOptions}
            label="Shirt Size"
            value={data.shirt_size || ''}
            onChange={onShirtSizeChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Select
            options={position}
            // fullWidth={true}
            label="Position"
            value={data.position || ''}
            onChange={onPositionChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            type="number"
            label="HS Graduation Year"
            value={data.hs_graduation_year || ''}
            onChange={onGraduationYearChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            type="number"
            label="GPA"
            value={data.gpa || ''}
            onChange={onGPAChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            type="number"
            label={`Jersey Number ${jerseyNumberRequired ? '(Required)' : null}`}
            value={data.jersey_number || ''}
            onChange={onJerseyNumberChange}
            isRequired={jerseyNumberRequired}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Instagram"
            value={data.player_instagram || ''}
            onChange={onInstagramChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Highlight Film URL"
            value={data.player_highlight_URL || ''}
            onChange={onHighlightUrlChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Sportrecruits URL"
            value={data.player_sportrecruits_url || ''}
            onChange={onSportRecruitsUrlChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Connectlax URL"
            value={data.player_connectlax_url || ''}
            onChange={onConnectLaxUrlChange}
          />
        </div>
      </div>
      <div className={styles.toolTipMessage}>
        <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
          Omitting data will eliminate it from any coaches books that might be
          distributed.
        </CardMessage>
      </div>
    </div>
  );
};

export default PlayerStats;
