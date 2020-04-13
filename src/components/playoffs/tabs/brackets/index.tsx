import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';
import styles from './styles.module.scss';
import { Select, CardMessage, Button } from 'components/common';
import Seed from 'components/playoffs/dnd/seed';
import Brackets from 'components/playoffs/brackets';

class BracketManager extends Component {
  dragType = 'seed';
  renderSeed = (item: any, index: number) => {
    return (
      <div className={styles.singleSeedWrapper}>
        <span>{index + 1}.</span>
        <Seed
          key={item.id}
          id={item.id}
          name={item.name}
          type={this.dragType}
        />
      </div>
    );
  };

  render() {
    const divisionsOptions = [{ label: '2020', value: 'ADLN001' }];
    const selectedDivision = divisionsOptions[0].value;
    const seeds = [
      { id: 1, name: 'Seed 1' },
      { id: 2, name: 'Seed 2' },
      { id: 3, name: 'Seed 3' },
      { id: 4, name: 'Seed 4' },
      { id: 5, name: 'Seed 5' },
      { id: 6, name: 'Seed 6' },
      { id: 7, name: 'Seed 7' },
      { id: 8, name: 'Seed 8' },
    ];

    return (
      <section className={styles.container}>
        <DndProvider backend={HTML5Backend}>
          <div className={styles.seedsContainer}>
            <Select
              label="Division"
              options={divisionsOptions}
              value={selectedDivision}
            />

            <div className={styles.seedsWrapper}>
              <h4>Seeds</h4>
              <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
                Drag & drop to reorder
              </CardMessage>
              <div className={styles.seedsList}>
                {seeds.map((v, i) => this.renderSeed(v, i))}
              </div>
            </div>
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
            <Brackets seeds={seeds} />
          </div>
        </DndProvider>
      </section>
    );
  }
}

export default BracketManager;
