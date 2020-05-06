import React, { Component } from 'react';
import { orderBy } from 'lodash-es';
import update from 'immutability-helper';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';
import { Select, CardMessage, Button } from 'components/common';
import SeedsList from './seeds-list';
import Brackets from 'components/playoffs/brackets';
import { IBracketGame, IBracketSeed } from 'components/playoffs/bracketGames';
import { IDivision } from 'common/models';
import AddGameModal, { IOnAddGame } from '../../add-game-modal';
import RemoveGameModal from '../../remove-game-modal';
import { ISeedDictionary } from 'components/playoffs';
import styles from './styles.module.scss';

interface IProps {
  divisions: IDivision[];
  historyLength: number;
  seeds?: ISeedDictionary;
  bracketGames?: IBracketGame[];
  advancingInProgress?: boolean;
  addGame: (selectedDivision: string, data: IOnAddGame) => void;
  removeGame: (selectedDivision: string, data: number) => void;
  onUndoClick: () => void;
  advanceTeamsToBrackets: () => void;
  updateSeeds: (
    selectedDivision: string,
    divisionSeeds: IBracketSeed[]
  ) => void;
}

interface IState {
  reorderMode: boolean;
  selectedDivision?: string;
  divisionsOptions?: { label: string; value: string }[];
  divisionGames?: IBracketGame[];
  addGameModalOpen: boolean;
  removeGameIndex: number | null;
  divisionSeeds?: IBracketSeed[];
}

class BracketManager extends Component<IProps, IState> {
  dragType = 'seed';
  state: IState = {
    reorderMode: false,
    addGameModalOpen: false,
    removeGameIndex: null,
  };

  componentDidMount() {
    const { divisions } = this.props;
    const divisionsOptions = divisions.map(item => ({
      label: item.short_name,
      value: item.division_id,
    }));
    const orderedDivisions = orderBy(divisionsOptions, 'label');

    this.setState({
      divisionsOptions: orderedDivisions,
      selectedDivision: orderedDivisions[0]?.value,
    });
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { bracketGames, seeds } = this.props;
    const { selectedDivision, divisionSeeds } = this.state;

    if (
      seeds &&
      selectedDivision &&
      (!divisionSeeds ||
        prevProps.seeds !== seeds ||
        prevState.selectedDivision !== selectedDivision)
    ) {
      this.setState({
        divisionSeeds: seeds[selectedDivision],
      });
    }

    if (
      prevProps.bracketGames !== bracketGames ||
      prevState?.selectedDivision !== this.state.selectedDivision
    ) {
      const divisionGames = bracketGames?.filter(
        game => game.divisionId === selectedDivision
      );
      this.setState({ divisionGames });
    }
  }

  toggleReorderMode = () =>
    this.setState(({ reorderMode }) => ({ reorderMode: !reorderMode }));

  addGamePressed = () => {
    this.setState({ addGameModalOpen: true });
  };

  onAddGame = (game: IOnAddGame) => {
    const { selectedDivision } = this.state;
    this.props.addGame(selectedDivision!, game);
    this.setState({ addGameModalOpen: false });
  };

  removeGamePressed = (gameIndex: number) => {
    this.setState({ removeGameIndex: gameIndex });
  };

  onRemoveGame = () => {
    const { removeGameIndex, selectedDivision } = this.state;
    if (!removeGameIndex || !selectedDivision) return;
    this.props.removeGame(selectedDivision, removeGameIndex);
    this.setState({ removeGameIndex: null });
  };

  onChangeSelect = (e: any) => {
    this.setState({
      selectedDivision: e.target.value,
    });
  };

  moveSeed = (dragIndex: number, hoverIndex: number) => {
    const { divisionSeeds } = this.state;

    if (!divisionSeeds) return;

    const dragCard = divisionSeeds[dragIndex];
    const updatedCards = update(divisionSeeds, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    });

    this.setState({ divisionSeeds: updatedCards });
  };

  cancelReorder = () => {
    const { seeds } = this.props;
    const { selectedDivision } = this.state;

    if (seeds && selectedDivision) {
      this.setState({
        divisionSeeds: seeds[selectedDivision],
      });
    }

    this.setState({ reorderMode: false });
  };

  saveReorder = () => {
    const { updateSeeds } = this.props;
    const { divisionSeeds, selectedDivision } = this.state;

    const newDivisionSeeds = divisionSeeds?.map((item, index) => ({
      ...item,
      id: index + 1,
      name: `Seed ${index + 1}`,
    }));

    updateSeeds(selectedDivision!, newDivisionSeeds!);
    this.setState({ reorderMode: false });
  };

  render() {
    const {
      onUndoClick,
      historyLength,
      advanceTeamsToBrackets,
      advancingInProgress,
    } = this.props;

    const {
      divisionGames,
      divisionsOptions,
      selectedDivision,
      addGameModalOpen,
      removeGameIndex,
      reorderMode,
      divisionSeeds,
    } = this.state;

    const seedsLength = divisionSeeds?.length || 0;
    const playInGamesExist = !!(
      seedsLength -
      2 ** Math.floor(Math.log2(seedsLength))
    );

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
              Seeds list
            </CardMessage>
            <SeedsList
              accept={this.dragType}
              reorderMode={reorderMode}
              seeds={divisionSeeds || []}
              moveSeed={this.moveSeed}
            />
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
                btnStyles={{ marginLeft: 20 }}
                label="+ Add Game"
                variant="text"
                color="secondary"
                onClick={this.addGamePressed}
              />
            </div>
            <div className={styles.buttonsWrapper}>
              <Button
                label="Undo"
                icon={getIcon(Icons.SETTINGS_BACKUP_RESTORE)}
                disabled={!historyLength || historyLength < 2}
                variant="text"
                color="secondary"
                onClick={onUndoClick}
              />
              <Button
                label="Go to Brackets Setup"
                variant="text"
                color="secondary"
                icon={getIcon(Icons.EDIT)}
              />
              <Button
                label="Advance Teams to Brackets"
                variant="contained"
                color="primary"
                disabled={advancingInProgress}
                onClick={advanceTeamsToBrackets}
              />
              <div className={styles.reorderTeamsWrapper}>
                {!reorderMode ? (
                  <Button
                    label="Manually Reorder Team Rankings"
                    variant="contained"
                    color="primary"
                    onClick={this.toggleReorderMode}
                  />
                ) : (
                  <div className={styles.reorderTeamsButtons}>
                    <Button
                      label="Cancel"
                      variant="text"
                      color="secondary"
                      onClick={this.cancelReorder}
                    />
                    <Button
                      label="Save Changes"
                      variant="outlined"
                      color="secondary"
                      onClick={this.saveReorder}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {addGameModalOpen && (
            <AddGameModal
              isOpen={addGameModalOpen}
              bracketGames={divisionGames?.filter(item => !item.hidden)!}
              playInGamesExist={playInGamesExist}
              onClose={() => this.setState({ addGameModalOpen: false })}
              onAddGame={this.onAddGame}
            />
          )}
          {removeGameIndex && (
            <RemoveGameModal
              isOpen={!!removeGameIndex}
              gameIndex={removeGameIndex}
              onClose={() => this.setState({ removeGameIndex: null })}
              onRemoveGame={this.onRemoveGame}
            />
          )}
          {divisionGames && divisionSeeds && (
            <Brackets
              seeds={divisionSeeds}
              games={divisionGames}
              onRemove={this.removeGamePressed}
            />
          )}
        </div>
      </section>
    );
  }
}

export default BracketManager;
