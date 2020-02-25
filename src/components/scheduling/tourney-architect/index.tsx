import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles.module.scss';
import {
  SectionDropdown,
  HeadingLevelThree,
  Button,
  Select,
  Input,
  Tooltip,
} from 'components/common';
import { ISchedule } from 'common/models/schedule';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule?: ISchedule;
  onChange: (name: string, value: any) => void;
  onViewEventMatrix: () => void;
}

export default (props: IProps) => {
  const { schedule, onChange, onViewEventMatrix } = props;
  const gameStartOptions = ['10s'];

  const localChange = (event: InputTargetValue) => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  const renderSectionCell = (name: string, value: any, icon?: IconProp) => (
    <div className={styles.sectionCell}>
      <div className={styles.sectionCellHeader}>
        <span>{name}</span>
        {!!icon && (
          <Tooltip
            type="info"
            title="Play Time is based on Facilities availability"
          >
            <div className={styles.infoCircle}>
              <FontAwesomeIcon color="#00A3EA" icon={icon} />
            </div>
          </Tooltip>
        )}
      </div>
      <p>{value}</p>
    </div>
  );

  return (
    <SectionDropdown type="section" isDefaultExpanded={true} useBorder={true}>
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Tourney Architect</span>
      </HeadingLevelThree>
      <div className={styles.tourneyArchitect}>
        <div className={styles.taFirst}>
          {renderSectionCell('Play Time Window', '8:30 - 5:30', faInfoCircle)}
          {renderSectionCell('Number of Fields', '8', faInfoCircle)}
          {renderSectionCell('Min/Max # of Games', '3/5', faInfoCircle)}
          {renderSectionCell(
            'Teams Registered/Max',
            `${schedule?.num_teams}/24`,
            faInfoCircle
          )}
        </div>
        <div className={styles.taSecond}>
          <div className={styles.calculation}>
            <Input
              width="140px"
              type="number"
              endAdornment="Minutes"
              label="Warmup"
            />
            <span className={styles.plainText}>+</span>
            <Input
              width="140px"
              type="number"
              endAdornment="Minutes"
              label="Division Duration"
            />
            <span className={styles.plainText}>
              (2)&nbsp;
              <Tooltip
                type="info"
                title="Play Time is based on Facilities availability"
              >
                <div className={styles.infoCircle}>
                  <FontAwesomeIcon color="#00A3EA" icon={faInfoCircle} />
                </div>
              </Tooltip>
              &nbsp;+
            </span>
            <Input
              width="140px"
              type="number"
              endAdornment="Minutes"
              label="Time Between Periods"
            />
            <span className={styles.plainText}>=&nbsp;50 Minutes</span>
          </div>
          <Select
            options={gameStartOptions.map(option => ({
              label: option,
              value: option,
            }))}
            value={gameStartOptions[0]}
            label="Games Start On"
            name="gamesStartOn"
            onChange={localChange}
          />
        </div>
        <div className={styles.taThird}>
          <span className={styles.totalGameSlots}>
            =&nbsp;128 Total Game Slots
          </span>
          <Button
            label="View Event Matrix"
            icon={<FontAwesomeIcon icon={faEye} />}
            color="secondary"
            variant="text"
            onClick={onViewEventMatrix}
          />
        </div>
      </div>
    </SectionDropdown>
  );
};
