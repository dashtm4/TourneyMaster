import React, { useState } from 'react';
import {
  TableCell,
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import { IGameCell } from '../helpers';
import {
  selectedIconMatrixColor,
  blockedCellsMatrixColor,
} from 'config/app.config';

interface IProps {
  gameId: number;
  homeTeamId: string;
  awayTeamId: string;
  isShow: boolean;
  isSamePool: boolean;
  onAddGame: (a: IGameCell) => void;
  onDeleteGame: (a: IGameCell) => void;
}

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: '1px solid black',
        padding: 0,
      },
    },
  },
});

const useStyles = makeStyles({
  blockedCell: {
    border: '1px solid black',
    backgroundColor: 'black',
  },
  selectedCell: {
    border: '1px solid black',
    backgroundColor: selectedIconMatrixColor,
  },
  availableCell: {
    border: '1px solid black',
    backgroundColor: 'lightgrey',
  },
  hiddenCell: {
    display: 'none',
    visibility: 'hidden',
  },
  undesirableCell: {
    border: '1px dashed black',
    backgroundColor: blockedCellsMatrixColor,
  },
});

const Cell = (props: IProps) => {
  const {
    gameId,
    homeTeamId,
    awayTeamId,
    isShow,
    isSamePool,
    onAddGame,
    onDeleteGame,
  } = props;
  const [isClicked, setIsClicked] = useState(false);
  let isDisabled = false;

  const classes = useStyles();

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
      return classes.blockedCell;
    }
    if (isClicked) {
      return classes.selectedCell;
    }
    if (!isSamePool) {
      return classes.undesirableCell;
    }
    return classes.availableCell;
  };

  return (
    <ThemeProvider theme={theme}>
      <TableCell className={getClass()} align="center" onClick={onCellClick} />
    </ThemeProvider>
  );
};

export default Cell;
