import React from 'react';
import styles from '../../styles.module.scss';
import { Input, Select } from 'components/common';
import { BindingCbWithTwo, ISelectOption } from 'common/models';
import { ITeamsRegister } from 'common/models/register';

interface ITeamProps {
  data: Partial<ITeamsRegister>;
  onChange: BindingCbWithTwo<string, string | number>;
  divisions: ISelectOption[];
  states: ISelectOption[];
  isInvited: boolean;
}

const Team = ({ data, onChange, divisions, states, isInvited }: ITeamProps) => {
  const onTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_name', e.target.value);

  const onTeamCityChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_city', e.target.value);

  const onTeamStateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('team_state', e.target.value);

  const onDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('ext_sku', e.target.value);

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
            isRequired={true}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="City"
            value={data.team_city || ''}
            onChange={onTeamCityChange}
            isRequired={true}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={states}
            label="State"
            value={data.team_state || ''}
            onChange={onTeamStateChange}
            isRequired={true}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={divisions}
            label="Division"
            value={data.ext_sku || ''}
            onChange={onDivisionChange}
            isRequired={true}
            disabled={isInvited}
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
