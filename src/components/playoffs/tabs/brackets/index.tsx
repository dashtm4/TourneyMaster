import React, { Component } from 'react';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';
import styles from './styles.module.scss';
import { Select, CardMessage, Button } from 'components/common';
import Seed from 'components/playoffs/dnd/seed';
import Brackets from 'components/playoffs/brackets';
import { IBracketGame, IBracketSeed } from 'components/playoffs/bracketGames';
import { IDivision } from 'common/models';

interface IProps {
  divisions: IDivision[];
  seeds?: IBracketSeed[];
  bracketGames?: IBracketGame[];
}

interface IState {
  selectedDivision?: string;
  divisionsOptions?: { label: string; value: string }[];
  divisionGames?: IBracketGame[];
}

class BracketManager extends Component<IProps> {
  dragType = 'seed';
  state: IState = {};

  componentDidMount() {
    const { divisions } = this.props;
    const divisionsOptions = divisions.map(item => ({
      label: item.short_name,
      value: item.division_id,
    }));

    this.setState({
      divisionsOptions,
      selectedDivision: divisionsOptions[0]?.value,
    });
  }

  componentDidUpdate(_: any, prevState: IState) {
    const { bracketGames } = this.props;
    const { selectedDivision } = this.state;

    if (prevState?.selectedDivision !== this.state.selectedDivision) {
      const divisionGames = bracketGames?.filter(
        game => game.divisionId === selectedDivision
      );
      this.setState({ divisionGames });
    }
  }

  onChangeSelect = (e: any) => {
    this.setState({
      selectedDivision: e.target.value,
    });
  };

  renderSeed = (item: any, index: number) => {
    return (
      <div key={`${index}-renderSeed`} className={styles.singleSeedWrapper}>
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
    const { seeds } = this.props;
    const { divisionGames, divisionsOptions, selectedDivision } = this.state;

    return (
      <section className={styles.container}>
        <div className={styles.seedsContainer}>
          {divisionsOptions && selectedDivision && (
            <Select
              label="Division"
              options={divisionsOptions}
              value={selectedDivision}
              onChange={this.onChangeSelect}
            />
          )}

          <div className={styles.seedsWrapper}>
            <h4>Seeds</h4>
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Drag & drop to reorder
            </CardMessage>
            <div className={styles.seedsList}>
              {seeds?.map((v, i) => this.renderSeed(v, i))}
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
          {seeds && divisionGames && (
            <Brackets games={divisionGames} seeds={seeds} />
          )}
        </div>
      </section>
    );
  }
}

export default BracketManager;
