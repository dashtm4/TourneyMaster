import React, { useEffect } from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Checkbox,
  CardMessage,
  Radio,
  Select,
} from 'components/common';
import styles from '../styles.module.scss';
import { EventDetailsDTO } from '../logic/model';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

const bracketTypeOptions = [
  'Single Elimination',
  'Double Elimination',
  '3 Game Guarantee',
];

const topNumberOfTeams = ['2', '3', '4', '5', '6', '7', '8'];

enum bracketTypesEnum {
  'Single Elimination' = 1,
  'Double Elimination' = 2,
  '3 Game Guarantee' = 3,
}

enum numTeamsBracketEnum {
  'Top:' = 1,
  'All' = 2,
}

interface Props {
  eventData: Partial<EventDetailsDTO>;
  onChange: any;
}

const PlayoffsSection: React.FC<Props> = ({ eventData, onChange }: Props) => {
  const { playoffs_exist, bracket_type, num_teams_bracket } = eventData;

  const onPlayoffs = () => onChange('playoffs_exist', playoffs_exist ? 0 : 1);

  const onChangeBracketType = (e: InputTargetValue) =>
    onChange('bracket_type', bracketTypesEnum[e.target.value]);

  const onNumberOfTeamsChange = (e: InputTargetValue) =>
    onChange(
      'num_teams_bracket',
      e.target.value === numTeamsBracketEnum[2]
        ? null
        : Number(topNumberOfTeams[topNumberOfTeams.length - 1])
    );

  const onChangeMaxTeamNumber = (e: InputTargetValue) =>
    onChange('num_teams_bracket', Number(e.target.value));

  useEffect(() => {
    if (playoffs_exist && !bracket_type)
      onChange('bracket_type', bracketTypesEnum['Single Elimination']);
  });

  return (
    <SectionDropdown type="section" padding="0">
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Playoffs</span>
      </HeadingLevelThree>
      <div className={styles['playoffs-details']}>
        <div className={styles['pd-first']}>
          <Checkbox
            formLabel=""
            options={[
              { label: 'Event has Playoffs', checked: Boolean(playoffs_exist) },
            ]}
            onChange={onPlayoffs}
          />
          <CardMessage type="info">
            Playoff settings include Bracket Type, # of Teams, and Ranking
            Factors
          </CardMessage>
        </div>
        {Boolean(playoffs_exist) && (
          <div className={styles['pd-second']}>
            <Radio
              formLabel="Bracket Type"
              options={bracketTypeOptions}
              onChange={onChangeBracketType}
              checked={bracketTypesEnum[bracket_type!]}
            />
            <Radio
              formLabel="# of Teams"
              options={['Top:', 'All']}
              onChange={onNumberOfTeamsChange}
              checked={numTeamsBracketEnum[num_teams_bracket ? 1 : 2]}
            />
            <Select
              label=""
              disabled={!num_teams_bracket}
              options={topNumberOfTeams}
              value={String(num_teams_bracket || '')}
              onChange={onChangeMaxTeamNumber}
            />
          </div>
        )}
      </div>
    </SectionDropdown>
  );
};

export default PlayoffsSection;
