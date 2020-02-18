import React from 'react';
import styles from '../styles.module.scss';
import { Input, Radio } from 'components/common';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

enum OptionsEnum {
  'Require' = 1,
  'Request' = 2,
  'None' = 0,
}

const TeamsAthletesInfo = ({ data, onChange }: any) => {
  const options = ['Require', 'Request', 'None'];

  const onMaxTeamsPerDivisionChange = (e: InputTargetValue) =>
    onChange('max_teams_per_division', e.target.value);

  const onMinAthletesOnRosterChange = (e: InputTargetValue) =>
    onChange('min_players_per_roster', e.target.value);

  const onMaxAthletesOnRosterChange = (e: InputTargetValue) =>
    onChange('max_players_per_roster', e.target.value);

  const onAthleteBirthDateChange = (e: InputTargetValue) =>
    onChange('request_athlete_birthdate', OptionsEnum[e.target.value]);

  const onAthleteJerseyNumberChange = (e: InputTargetValue) =>
    onChange('request_athlete_jersey_number', OptionsEnum[e.target.value]);

  const onAthleteEmailChange = (e: InputTargetValue) =>
    onChange('request_athlete_email', OptionsEnum[e.target.value]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionFirstRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Max Teams Per Division"
            type="number"
            // value={data.max_teams_per_division || ''}
            onChange={onMaxTeamsPerDivisionChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Min Athletes on Roster"
            type="number"
            // value={data.min_players_per_roster || ''}
            onChange={onMinAthletesOnRosterChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Max Athletes on Roster"
            type="number"
            // value={data.max_players_per_roster || ''}
            onChange={onMaxAthletesOnRosterChange}
          />
        </div>
        <div className={styles.sectionItem} />
      </div>
      <div className={styles.sectionSecondRow}>
        <div className={styles.sectionItem}>
          <Radio
            options={options}
            formLabel="Athlete Birth Date"
            onChange={onAthleteBirthDateChange}
            checked={OptionsEnum[data.request_athlete_birthdate || 2]}
          />
        </div>
        <div className={styles.sectionItem}>
          <Radio
            options={options}
            formLabel="Athlete Jersey Number"
            onChange={onAthleteJerseyNumberChange}
            checked={OptionsEnum[data.request_athlete_jersey_number || 2]}
          />
        </div>
        <div className={styles.sectionItem}>
          <Radio
            options={options}
            formLabel="Athlete Email"
            onChange={onAthleteEmailChange}
            checked={OptionsEnum[data.request_athlete_email || 2]}
          />
        </div>
        <div className={styles.sectionItem} />
      </div>
    </div>
  );
};

export default TeamsAthletesInfo;
