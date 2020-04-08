import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button, Paper, Select, CardMessage } from 'components/common';
import Brackets from './brackets';
import styles from './styles.module.scss';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';
import Seed from './dnd/seed';

interface ISeed {
  id: number;
  name: string;
}

interface IState {
  seeds?: ISeed[];
}

class Playoffs extends Component<{}, IState> {
  dragType = 'seed';
  state = {
    seeds: [
      { id: 1, name: 'Seed 1' },
      { id: 2, name: 'Seed 2' },
      { id: 3, name: 'Seed 3' },
      { id: 4, name: 'Seed 4' },
      { id: 5, name: 'Seed 5' },
      { id: 6, name: 'Seed 6' },
      { id: 7, name: 'Seed 7' },
      { id: 8, name: 'Seed 8' },
    ],
  };

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

  addGame = () => {
    this.setState(({ seeds }) => ({
      seeds: [
        ...(seeds || []),
        {
          id: (seeds?.length || 0) + 1,
          name: `Seed ${(seeds?.length || 0) + 1}`,
        },
      ],
    }));
  };

  render() {
    const divisionsOptions = [{ label: '2020', value: 'ADLN001' }];
    const selectedDivision = divisionsOptions[0].value;
    const { seeds } = this.state;

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
                  <Button
                    label="+ Add Game"
                    variant="text"
                    color="secondary"
                    onClick={this.addGame}
                  />
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
      </div>
    );
  }
}

export default Playoffs;
