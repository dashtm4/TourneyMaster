import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';

import {
  SectionDropdown,
  HeadingLevelThree,
  HeadingLevelFour,
  Button,
  Paper,
} from 'components/common';
import styles from '../styles.module.scss';

export default () => {
  return (
    <SectionDropdown type="section" padding="0" isDefaultExpanded={true}>
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Brackets</span>
      </HeadingLevelThree>
      <div className={styles.brackets}>
        <Paper padding={20}>
          <div className={styles.header}>
            <HeadingLevelFour>
              <span>Men's Spring Thaw (2020, 2021)</span>
            </HeadingLevelFour>
            <Button
              icon={<FontAwesomeIcon icon={faNetworkWired} />}
              label="Manage Bracket"
              color="secondary"
              variant="text"
            />
          </div>
          <div className={styles.tournamentName}>
            <div className={styles.tnFirst}>
              <div className={styles.sectionCellHor}>
                <span>Teams:</span>
                <p>24</p>
              </div>
            </div>
            <div className={styles.tnSecond}>
              <div className={styles.sectionCellHor}>
                <span>Dates:</span>
                <p>02/08/20 - 02/09/20</p>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </SectionDropdown>
  );
};
