import React, { useState } from 'react';
import { TableCell, makeStyles } from '@material-ui/core';
import { IGameCell } from '../helpers';

interface IProps {
  homeTeamId: string;
  awayTeamId: string;
  divisionId: string;
  divisionHex: string;
  divisionName: string;
  onAddGame: (a: IGameCell) => void;
  onDeleteGame: (a: IGameCell) => void;
  isShow: boolean;
  isSamePool: boolean;
  isSelected: boolean;
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
  const { homeTeamId, awayTeamId, divisionId, divisionHex, divisionName, isShow, isSamePool, isSelected, onAddGame, onDeleteGame } = props;
  const classes = useStyles();
  const [isActive, setActive] = useState(isSelected);
  let isDisabled = false;

  if (homeTeamId === awayTeamId) {
    isDisabled = !isDisabled;
  }

  const onCellClick = () => {
    if (isDisabled) {
      return;
    }
    const item = {
      homeTeamId,
      awayTeamId,
      divisionId,
      divisionHex,
      divisionName,
    } as IGameCell;
    setActive(!isActive);
    if (isActive) {
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
    if (isActive) {
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
