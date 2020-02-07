import React from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Checkbox,
  CardMessage,
  // Radio,
  // Select,
} from 'components/common';
import styles from '../styles.module.scss';

interface Props {
  bracketTypeOptions: string[];
  topNumberOfTeams: string[];
  onChange: any;
}

const PlayoffsSection: React.FC<Props> = ({
  // bracketTypeOptions,
  // topNumberOfTeams,
  onChange,
}: Props) => (
  <SectionDropdown type="section" padding="0">
    <HeadingLevelThree>
      <span className={styles.blockHeading}>Playoffs</span>
    </HeadingLevelThree>
    <div className={styles['playoffs-details']}>
      <div className={styles['pd-first']}>
        <Checkbox formLabel="" options={[]} onChange={onChange} />
        <CardMessage type="info">
          Playoff settings include Bracket Type, # of Teams, and Ranking Factors
        </CardMessage>
      </div>
      {/* <div className={styles['pd-second']}>
        <Radio
          formLabel="Bracket Type"
          options={bracketTypeOptions}
          onChange={onChange}
        />
        <Radio
          formLabel="# of Teams"
          options={['Top:', 'All']}
          onChange={onChange}
        />
        <Select
          label=""
          options={topNumberOfTeams}
          value={topNumberOfTeams[0]}
          onChange={onChange}
        />
      </div> */}
    </div>
  </SectionDropdown>
);

export default PlayoffsSection;
