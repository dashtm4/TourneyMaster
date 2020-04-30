import React from 'react';
import styles from '../../styles.module.scss';
import { Input, Select } from 'components/common';
import { BindingCbWithTwo } from 'common/models';
import { ITeamsRegister } from 'common/models/register';

interface ITeamProps {
  data: Partial<ITeamsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
}
const teamLevelOptions = [{ label: 'Level1', value: 'level1' }];

const Team = ({ data, onChange }: ITeamProps) => {
  const onTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_name', e.target.value);

  const onTeamCityChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_city', e.target.value);

  const onTeamStateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_state', e.target.value);

  const onTeamLevelChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_level', e.target.value);

  const onTeamWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_website', e.target.value);

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Team Name"
            value={data.team_name || ''}
            onChange={onTeamNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="City"
            value={data.team_city || ''}
            onChange={onTeamCityChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="State"
            value={data.team_state || ''}
            onChange={onTeamStateChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={teamLevelOptions}
            label="Team Level"
            value={data.team_level || ''}
            onChange={onTeamLevelChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Team Website"
            value={data.team_website || ''}
            onChange={onTeamWebsiteChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Team;
