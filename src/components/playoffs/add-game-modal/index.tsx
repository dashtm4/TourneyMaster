import React, { useEffect } from 'react';
import { maxBy } from 'lodash-es';
import { Button, Modal, Select } from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { IInputEvent } from 'common/types';
import { IBracketGame } from '../bracketGames';

export interface IOnAddGame {
  awayDependsUpon: string;
  homeDependsUpon: string;
  gridNum: number;
  isWinner: boolean;
}

interface Props {
  isOpen: boolean;
  playInGamesExist: boolean;
  bracketGames: IBracketGame[];
  onClose: BindingAction;
  onAddGame: (data: IOnAddGame) => void;
}

const PopupDeleteConfirm = ({
  isOpen,
  onClose,
  bracketGames,
  onAddGame,
  playInGamesExist,
}: Props) => {
  const [awaySourceOptions, setAwaySourceOptions] = React.useState<
    { label: string; value: number }[] | []
  >([]);
  const [homeSourceOptions, setHomeSourceOptions] = React.useState<
    { label: string; value: number }[] | []
  >([]);

  const [awaySourceSelected, setAwaySourceSelected] = React.useState<
    string | ''
  >('');
  const [homeSourceSelected, setHomeSourceSelected] = React.useState<
    string | ''
  >('');

  useEffect(() => {
    const negativeRounds = bracketGames
      .map(item => item.round)
      .filter(item => item <= 0);

    const source = bracketGames.map(item => ({
      label: `Loser ${item.index}`,
      value: -item.index,
    }));

    if (negativeRounds?.length) {
      source.push(
        ...bracketGames
          .filter(item => item.round <= 0)
          .map(item => ({
            label: `Winner ${item.index}`,
            value: item.index,
          }))
      );
    }

    setAwaySourceOptions(source);
    setHomeSourceOptions(source);
  }, [bracketGames]);

  const onAwaySourceChange = (e: IInputEvent) =>
    setAwaySourceSelected(e.target.value);
  const onHomeSourceChange = (e: IInputEvent) =>
    setHomeSourceSelected(e.target.value);

  const addGame = () => {
    const awaySourceSelectedNum = Number(awaySourceSelected);
    const homeSourceSelectedNum = Number(homeSourceSelected);

    const maxGridNum = maxBy(bracketGames, 'gridNum')?.gridNum;

    const awaySource = bracketGames.find(
      item => item.index === awaySourceSelectedNum
    );
    const homeSource = bracketGames.find(
      item => item.index === homeSourceSelectedNum
    );

    const awaySourceGrid = awaySource?.gridNum;
    const homeSourceGrid = homeSource?.gridNum;
    const awaySourceRound = awaySource?.round;
    const homeSourceRound = homeSource?.round;

    const gridNum =
      awaySourceGrid === homeSourceGrid &&
      awaySourceRound === homeSourceRound &&
      awaySourceRound === 1 &&
      !playInGamesExist
        ? awaySourceGrid!
        : (maxGridNum || 1) + 1;

    const isWinner = awaySourceSelectedNum > 0 && homeSourceSelectedNum > 0;

    onAddGame({
      awayDependsUpon: String(Math.abs(awaySourceSelectedNum)),
      homeDependsUpon: String(Math.abs(homeSourceSelectedNum)),
      gridNum,
      isWinner,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.popupWrapper}>
        <h2 className={styles.title}>Add Game</h2>
        <div>
          <Select
            options={awaySourceOptions}
            value={awaySourceSelected}
            placeholder="Select"
            label="Select Away Source"
            onChange={onAwaySourceChange}
          />
          <Select
            options={homeSourceOptions}
            value={homeSourceSelected}
            placeholder="Select"
            label="Select Home Source"
            onChange={onHomeSourceChange}
          />
        </div>
        <Button
          label="Add"
          variant="contained"
          color="primary"
          onClick={addGame}
        />
      </section>
    </Modal>
  );
};

export default PopupDeleteConfirm;
