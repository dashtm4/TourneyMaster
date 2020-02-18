import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import styles from '../styles.module.scss';
import {
  SectionDropdown,
  HeadingLevelThree,
  HeadingLevelFour,
  Button,
  Paper,
  Select,
} from 'components/common';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  onChange: (name: string, value: any) => void;
}

export default (props: IProps) => {
  const { onChange } = props;
  const gameStartOptions = ['10s'];

  const localChange = (event: InputTargetValue) => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <SectionDropdown type="section" padding="0" isDefaultExpanded={false}>
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Tourney Architect</span>
      </HeadingLevelThree>
      <div className={styles.tourneyArchitect}>
        <Paper padding={20}>
          <div className={styles.header}>
            <HeadingLevelFour>
              <span>Event Structure</span>
            </HeadingLevelFour>
            <Button
              icon={<FontAwesomeIcon icon={faEdit} />}
              label="Edit Event Structure"
              color="secondary"
              variant="text"
            />
          </div>
          <div className={styles.eventStructure}>
            <div className={styles.esFirst}>
              <div className={styles.sectionCell}>
                <span>Event Type</span>
                <p>Tournament</p>
              </div>
              <div className={styles.sectionCell}>
                <span>Time Division</span>
                <p>Halves (2)</p>
              </div>
              <div className={styles.sectionCell}>
                <span>Results Display</span>
                <p>Show Goals Scored</p>
              </div>
              <div className={styles.sectionCell}>
                <span>Playoff Games Needed</span>
                <p>3</p>
              </div>
            </div>
            <div className={styles.esSecond}>
              <div className={styles.sectionCell}>
                <span>Max # of Teams</span>
                <p>12</p>
              </div>
              <div className={styles.sectionCell}>
                <span>Max # of Games</span>
                <p>8</p>
              </div>
              <div className={styles.sectionCell}>
                <span>Max # of Days</span>
                <p>4</p>
              </div>
              <div className={styles.sectionCell}>
                <span>Min # of Game Guarantee</span>
                <p>3</p>
              </div>
            </div>
            <div className={styles.sectionCell}>
              <span>Game Duration</span>
              <p>
                5 Min Warmup + 20 Min Divisions (2) + 5 Min Between Periods = 50
                Minutes Total Runtime
              </p>
            </div>
            <div className={styles.esFourth}>
              <div className={styles.sectionCell}>
                <span>Facilities Hours</span>
                <p>The Proving Grounds:</p>
                <p>Main Stadium: 8:00 AM - 8:00 PM</p>
              </div>
              <Button
                icon={<FontAwesomeIcon icon={faEdit} />}
                label="Edit Facilities"
                color="secondary"
                variant="text"
              />
            </div>
          </div>
        </Paper>
        <div className={styles.gamesStartOn}>
          <Select
            options={gameStartOptions}
            value={gameStartOptions[0]}
            label="Games Start On"
            name="gamesStartOn"
            onChange={localChange}
          />
        </div>
      </div>
    </SectionDropdown>
  );
};
