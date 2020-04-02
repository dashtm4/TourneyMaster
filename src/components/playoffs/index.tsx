import React, { Component } from 'react';
import { Button, Paper, Select, CardMessage } from 'components/common';
import Brackets from './brackets';
import styles from './styles.module.scss';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';

class Playoffs extends Component {
  render() {
    const divisionsOptions = [{ label: '2020', value: 'ADLN001' }];
    const selectedDivision = divisionsOptions[0].value;
    return (
      <div className={styles.container}>
        <div className={styles.paperWrapper}>
          <Paper>
            <div className={styles.paperContainer}>
              <Button label="Close" variant="text" color="secondary" />
              <Button label="Save" variant="contained" color="primary" />
            </div>
          </Paper>
        </div>

        <section className={styles.section}>
          <div className={styles.seedsContainer}>
            <Select
              label="Division"
              options={divisionsOptions}
              value={selectedDivision}
            />

            <div className={styles.seedsWrapper}></div>
          </div>

          <div className={styles.bodyWrapper}>
            <div className={styles.bracketActions}>
              <div className={styles.cardMessage}>
                <CardMessage
                  type={CardMessageTypes.EMODJI_OBJECTS}
                  style={{ maxWidth: 400 }}
                >
                  Drag, drop, and zoom to navigate the bracket
                </CardMessage>
              </div>
              <div className={styles.buttonsWrapper}>
                <Button
                  label="Go to Bracket Setup"
                  variant="text"
                  color="secondary"
                  icon={getIcon(Icons.EDIT)}
                />
                <Button
                  label="See Team Lineup"
                  variant="text"
                  color="secondary"
                  icon={getIcon(Icons.EYE)}
                />
                <Button
                  label="Advance Division Teams to Brackets"
                  variant="contained"
                  color="primary"
                />
              </div>
            </div>
            <Brackets />
          </div>
        </section>
      </div>
    );
  }
}

export default Playoffs;
