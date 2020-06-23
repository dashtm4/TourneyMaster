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
import { ITeam } from 'common/models/teams';
import { IGameCell } from '../helpers';

interface IProps {
  teams: ITeam[] | undefined;
  showNames: boolean;
  games: IGameCell[];
}

const useStyles = makeStyles({
  tableContainer: {
    height: '50vh',
    overflow: 'auto',
  },
  tableCell: {
    border: 0,
    whiteSpace: 'nowrap',
  },
  tableHeaderCell: {
    borderBottom: '2px solid black',
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
    whiteSpace: 'nowrap',
  },
});

const ResultingGameList = (props: IProps) => {
  const { teams, games, showNames } = props;
  const classes = useStyles();

  return (
    <div>
      <div className={classes.labelWrapp}> Resulting Games List </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table size="small" stickyHeader={true}>
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
            {games.map((row, index) => {
              const homeTeamIndex = teams!.findIndex(
                o => o.team_id === row.homeTeamId
              );
              const awayTeamIndex = teams!.findIndex(
                o => o.team_id === row.awayTeamId
              );
              const homeTeamName = teams && teams[homeTeamIndex].short_name;
              const awayTeamName = teams && teams[awayTeamIndex].short_name;
              return (
                <TableRow
                  key={index}
                  className={
                    (index + 1) % 2 === 1
                      ? classes.oddTableCell
                      : classes.tableCell
                  }
                >
                  <TableCell align="center"> {index + 1} </TableCell>
                  <TableCell align="center">
                    {showNames ? (
                      homeTeamName
                    ) : (
                      <p title={homeTeamName}>{homeTeamIndex + 1}</p>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {showNames ? (
                      awayTeamName
                    ) : (
                      <p title={awayTeamName}>{awayTeamIndex + 1}</p>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResultingGameList;
