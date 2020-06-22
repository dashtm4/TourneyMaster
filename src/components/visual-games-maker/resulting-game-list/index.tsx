import React from 'react';
import {
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { ITeam } from "common/models/teams";

interface IGame {
  home_game_id: number;
  away_game_id: number;
}

interface IProps {
  teams: ITeam[] | undefined;
  games: IGame[];
  type: number;
}

enum DisplayedLabelType {
  Index,
  Name,
}

const useStyles = makeStyles({
  tableTeamCell: {
    border: 0,
  },
  tableCountCell: {
    fontWeight: 700,
    border: 0,
  },
  tableCell: {
    border: 0,
  },
  tableHeaderCell: {
    borderBottom: '2px solid black',
  },
  tableFooterCell: {
    borderTop: '2px solid black',
  },
  labelWrapp: {
    background: 'linear-gradient(121deg, #073b65 38%, #0079ae)',
    padding: '8px',
    marginBottom: '8px',
    color: 'white',
    textAlign: 'center',
  },
  oddTableCell: {
    border: 0,
    backgroundColor: 'rgb(235, 235, 235)',
  },
});

const ResultingGameList = (props: IProps) => {
  const { teams, games, type } = props;
  const classes = useStyles();

  return (
    <div>
      <div className={classes.labelWrapp}> Resulting Games List </div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} align="center">
                Game #
              </TableCell>
              <TableCell className={classes.tableHeaderCell} align="center">
                Home
              </TableCell>
              <TableCell className={classes.tableHeaderCell} align="center">
                Away
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((row, index) => (
              <TableRow key={index}>
                <TableCell className={((index + 1)%2 === 1)? classes.oddTableCell : classes.tableCell} align="center">
                  {index + 1}
                </TableCell>
                <TableCell className={((index + 1)%2 === 1)? classes.oddTableCell : classes.tableCell} align="center">
                  {type === DisplayedLabelType.Index ? row.home_game_id : teams && teams[row.home_game_id - 1].short_name || '' }
                </TableCell>
                <TableCell className={((index + 1)%2 === 1)? classes.oddTableCell : classes.tableCell} align="center">
                  {type === DisplayedLabelType.Index ? row.away_game_id : teams && teams[row.away_game_id - 1].short_name || '' }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResultingGameList;
