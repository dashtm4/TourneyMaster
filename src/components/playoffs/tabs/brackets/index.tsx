import React, { Component } from 'react';
import { orderBy } from 'lodash-es';
import { History } from 'history';
import update from 'immutability-helper';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';
import { Select, CardMessage, Button, Tooltip } from 'components/common';
import SeedsList from './seeds-list';
import Brackets from 'components/playoffs/brackets';
import { IBracketGame, IBracketSeed } from 'components/playoffs/bracketGames';
import { IDivision, IBracket } from 'common/models';
import AddGameModal, { IOnAddGame } from '../../add-game-modal';
import RemoveGameModal from '../../remove-game-modal';
import { ISeedDictionary } from 'components/playoffs';
import BracketsSetupModal from '../../brackets-setup-modal';
import { errorToast } from 'components/common/toastr/showToasts';
import styles from './styles.module.scss';

interface IProps {
  match: any;
  history: History;
  bracket: IBracket;
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
  saveBracketsData: () => void;
}

interface IState {
  reorderMode: boolean;
  selectedDivision?: string;
  divisionsOptions?: { label: string; value: string }[];
  divisionGames?: IBracketGame[];
  addGameModalOpen: boolean;
  removeGameIndex: number | null;
  divisionSeeds?: IBracketSeed[];
  bracketsSetupOpen: boolean;
  bracketsScoringOpen: boolean;
}

class BracketManager extends Component<IProps, IState> {
  dragType = 'seed';
  state: IState = {
    reorderMode: false,
    addGameModalOpen: false,
    bracketsSetupOpen: false,
    bracketsScoringOpen: false,
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

  scoreGamesPressed = () => this.setState({ bracketsScoringOpen: true });

  openBracketsModal = () => this.setState({ bracketsSetupOpen: true });

  closeBracketsModal = () =>
    this.setState({ bracketsSetupOpen: false, bracketsScoringOpen: false });

  bracketsModalOnSecondary = () => {
    const { bracketsSetupOpen, bracketsScoringOpen } = this.state;
    switch (true) {
      case bracketsSetupOpen:
        return this.navigateToBracketsSetup();
      case bracketsScoringOpen:
        return this.navigateToScoringBrackets();
    }
  };

  bracketsModalOnPrimary = () => {
    const { bracketsSetupOpen, bracketsScoringOpen } = this.state;
    switch (true) {
      case bracketsSetupOpen:
        return this.navigateToBracketsSetupWithSaving();
      case bracketsScoringOpen:
        return this.navigateToScoringBracketsWithSaving();
    }
  };

  /* BRACKETS SETUP NAVIGATION */
  navigateToBracketsSetup = () => {
    const { match, history } = this.props;
    const { eventId } = match.params;

    if (!eventId) {
      return errorToast("Can't navigate to the brackets setup.");
    }

    const url = `/event/event-details/${eventId}#playoffs`;
    history?.push(url);
  };

  navigateToBracketsSetupWithSaving = () => {
    this.props.saveBracketsData();
    setTimeout(() => this.navigateToBracketsSetup(), 500);
  };

  /* SCORING BRACKETS NAVIGATION */
  navigateToScoringBrackets = () => {
    const { eventId } = this.props.match?.params;

    if (!eventId) {
      return errorToast('Cannot navigate to the scoring page');
    }

    const url = `/event/scoring/${eventId}`;
    this.props.history.push(url);
  };

  navigateToScoringBracketsWithSaving = () => {
    this.props.saveBracketsData();
    setTimeout(() => this.navigateToScoringBrackets(), 500);
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
      bracketGames,
      bracket,
    } = this.props;

    const {
      divisionGames,
      divisionsOptions,
      selectedDivision,
      addGameModalOpen,
      removeGameIndex,
      reorderMode,
      divisionSeeds,
      bracketsSetupOpen,
      bracketsScoringOpen,
    } = this.state;

    const seedsLength = divisionSeeds?.length || 0;
    const playInGamesExist = !!(
      seedsLength -
      2 ** Math.floor(Math.log2(seedsLength))
    );

    const advanceTeamsDisabled = bracketGames?.some(
      item => item.awayTeamId || item.homeTeamId
    );
    const seedsReorderDisabled =
      divisionGames?.some(item => item.awayTeamScore || item.homeTeamScore) ||
      !advanceTeamsDisabled;

    const publishedBracket = bracket?.published;

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
              {publishedBracket && (
                <Button
                  btnStyles={{ marginLeft: 20 }}
                  label="Score Games"
                  variant="text"
                  color="secondary"
                  icon={getIcon(Icons.EDIT)}
                  onClick={this.scoreGamesPressed}
                />
              )}
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
                icon={getIcon(Icons.SETTINGS)}
                onClick={this.openBracketsModal}
              />
              <Tooltip
                disabled={!advanceTeamsDisabled}
                type="info"
                title="Teams are already advanced to the Brackets"
              >
                <div>
                  <Button
                    label="Advance Teams to Brackets"
                    variant="contained"
                    color="primary"
                    disabled={advancingInProgress || advanceTeamsDisabled}
                    onClick={advanceTeamsToBrackets}
                  />
                </div>
              </Tooltip>
              <div className={styles.reorderTeamsWrapper}>
                {!reorderMode ? (
                  <Tooltip
                    disabled={!seedsReorderDisabled}
                    type="info"
                    title="Reorder of Team Rankings is disabled due to the Non-Advanced / Scored teams reason"
                  >
                    <div>
                      <Button
                        label="Manually Reorder Team Rankings"
                        variant="contained"
                        color="primary"
                        disabled={seedsReorderDisabled}
                        onClick={this.toggleReorderMode}
                      />
                    </div>
                  </Tooltip>
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
          {(bracketsSetupOpen || bracketsScoringOpen) && (
            <BracketsSetupModal
              isOpen={bracketsSetupOpen || bracketsScoringOpen}
              title={
                bracketsSetupOpen
                  ? 'Brackets Setup'
                  : bracketsScoringOpen
                  ? 'Scoring Brackets'
                  : ''
              }
              onClose={this.closeBracketsModal}
              onSecondary={this.bracketsModalOnSecondary}
              onPrimary={this.bracketsModalOnPrimary}
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
