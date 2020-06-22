import React, { useState } from 'react';
import { TableCell, makeStyles } from '@material-ui/core';

interface IProps {
  home_game_index: number;
  away_game_index: number;
  onAddGame: (a: IGame) => void;
  onDeleteGame: (a: IGame) => void;
}

interface IGame {
  home_game_id: number;
  away_game_id: number;
}

const useStyles = makeStyles({
  inactiveCell: {
    border: '1px solid black',
    backgroundColor: 'black',
    color: 'white',
    padding: '10px',
    height: '10px',
  },
  selectedCell: {
    border: '1px solid black',
    backgroundColor: 'lightgreen',
    padding: '10px',
    height: '10px',
  },
  activeCell: {
    border: '1px solid black',
    backgroundColor: 'lightgrey',
    padding: '10px',
    height: '10px',
  },
});

const Cell = (props: IProps) => {
  const { home_game_index, away_game_index, onAddGame, onDeleteGame } = props;
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState(false);
  let isDisabled = false;

  if (home_game_index === away_game_index) {
    isDisabled = !isDisabled;
  }

  const onCellClick = () => {
    if (isDisabled) {
      return;
    }
    const item = {
      home_game_id: home_game_index,
      away_game_id: away_game_index,
    } as IGame;
    setIsClicked(!isClicked);
    if (isClicked) {
      onDeleteGame(item);
      return;
    }
    onAddGame(item);
  };

  const getClass = () => {
    if (isDisabled) {
      return classes.inactiveCell;
    }
    if (isClicked) {
      return classes.selectedCell;
    }
    return classes.activeCell;
  };

  return (
    <TableCell className={getClass()} align="center" onClick={onCellClick} />
  );
};

export default Cell;
