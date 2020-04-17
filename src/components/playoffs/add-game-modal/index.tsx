import React, { useEffect } from 'react';
import { Button, Modal, Select } from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { IInputEvent } from 'common/types';
import { IBracketGame } from '../bracketGames';

export interface IOnAddGame {
  awayDependsUpon: string;
  homeDependsUpon: string;
}

interface Props {
  isOpen: boolean;
  onClose: BindingAction;
  bracketGames: IBracketGame[];
  onAddGame: (data: IOnAddGame) => void;
}

const PopupDeleteConfirm = ({
  isOpen,
  onClose,
  bracketGames,
  onAddGame,
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
      value: item.index,
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
    onAddGame({
      awayDependsUpon: awaySourceSelected,
      homeDependsUpon: homeSourceSelected,
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
