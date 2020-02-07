import React from 'react';

import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Radio,
  Checkbox,
} from 'components/common';

import styles from '../styles.module.scss';

interface Props {
  eventTypeOptions: string[];
  timeDivisionOptions: string[];
  resultsDisplayOptions: string[];
  esDetailsOptions: string[];
  totalRuntimeMin: string | null | undefined;
  onChange: any;
}

const EventStructureSection: React.FC<Props> = ({
  eventTypeOptions,
  timeDivisionOptions,
  // resultsDisplayOptions,
  totalRuntimeMin,
  // esDetailsOptions,
  onChange,
}: Props) => (
  <SectionDropdown type="section" padding="0">
    <HeadingLevelThree>
      <span className={styles.blockHeading}>Event Structure</span>
    </HeadingLevelThree>
    <div className={styles['es-details']}>
      <div className={styles['es-details-first']}>
        <div className={styles.column}>
          <Radio
            options={eventTypeOptions}
            formLabel="Event Type"
            onChange={onChange}
          />
        </div>
        <div className={styles.column}>
          <Radio
            options={timeDivisionOptions}
            formLabel="Time Division"
            onChange={onChange}
          />
        </div>
        <div className={styles.column}>
          <Checkbox
            options={[]}
            formLabel="Results Display"
            onChange={onChange}
          />
        </div>
        <Input width="250px" fullWidth={true} label="Min # of Game Guarantee" />
      </div>
      <div className={styles['es-details-second']}>
        <Input
          width="170px"
          fullWidth={true}
          endAdornment="Minutes"
          label="Pregame Warmup"
        />
        <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
        <Input
          width="170px"
          fullWidth={true}
          endAdornment="Minutes"
          label="Time Division Duration"
        />
        <span className={styles.innerSpanText}>&nbsp;(2)&nbsp;+&nbsp;</span>
        <Input
          width="170px"
          fullWidth={true}
          endAdornment="Minutes"
          label="Time Between Periods"
        />
        <span className={styles.innerSpanText}>
          &nbsp;=&nbsp;{totalRuntimeMin} Minutes Total Runtime
        </span>
      </div>
      <div className={styles['es-details-third']}>
        <Checkbox
          options={[]}
          formLabel="Results Display"
          onChange={onChange}
        />
      </div>
    </div>
  </SectionDropdown>
);

export default EventStructureSection;
