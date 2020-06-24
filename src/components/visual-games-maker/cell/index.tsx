import React, { useState } from 'react';
import { TableCell, makeStyles } from '@material-ui/core';
import { IGameCell } from '../helpers';

interface IProps {
  gameId: number;
  homeTeamId: string;
  awayTeamId: string;
  onAddGame: (a: IGameCell) => void;
  onDeleteGame: (a: IGameCell) => void;
  isShow: boolean;
  isSamePool: boolean;
}

const useStyles = makeStyles({
  inactiveCell: {
    border: '1px solid black',
    backgroundColor: 'black',
  },
  selectedCell: {
    border: '1px solid black',
    backgroundColor: 'rgb(198, 239, 206)',
  },
  activeCell: {
    border: '1px solid black',
    backgroundColor: 'lightgrey',
  },
  hiddenCell: {
    display: 'none',
    visibility: 'hidden',
  },
  blockedCell: {
    border: '1px dashed black',
    backgroundColor: 'rgb(255, 201, 202)',
  }
});

const Cell = (props: IProps) => {
  const { gameId, homeTeamId, awayTeamId, isShow, isSamePool, onAddGame, onDeleteGame } = props;
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState(false);
  let isDisabled = false;

  if (homeTeamId === awayTeamId) {
    isDisabled = !isDisabled;
  }

  const onCellClick = () => {
    if (isDisabled) {
      return;
    }
    const item = {
      gameId,
      homeTeamId,
      awayTeamId,
    } as IGameCell;
    setIsClicked(!isClicked);
    if (isClicked) {
      onDeleteGame(item);
      return;
    }
    onAddGame(item);
  };

  const getClass = () => {
    if (!isShow) {
      return classes.hiddenCell;
    }
    if (isDisabled) {
      return classes.inactiveCell;
    }
    if (isClicked) {
      return classes.selectedCell;
    }
    if (!isSamePool) {
      return classes.blockedCell;
    }
    return classes.activeCell;
  };

  return (
    <TableCell className={getClass()} align="center" onClick={onCellClick} />
  );
};

export default Cell;
