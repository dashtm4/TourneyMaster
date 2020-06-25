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
  TableFooter,
} from '@material-ui/core';
import { ITeam } from 'common/models/teams';
import { IGameCell } from '../helpers';

interface ITableRunningTally<T> {
  team_id: string;
  team_name: T;
  count_of_home_games: number;
  count_of_away_games: number;
  count_of_all_games: number;
}

interface IProps {
  teams: ITeam[] | undefined;
  showNames: boolean;
  games: IGameCell[];
}

const useStyles = makeStyles({
  tableContainer: {
    maxHeight: '428px',
    minWidth: '360px',
    overflowY: 'auto',
    overflowX: 'visible',
  },
  tableTeamCell: {
    backgroundColor: 'rgb(235, 235, 235)',
    whiteSpace: 'nowrap',
    fontSize: '12px',
  },
  tableCountCell: {
    fontWeight: 700,
    border: 0,
    fontSize: '12px',
  },
  tableCell: {
    border: 0,
    fontSize: '12px',
  },
  tableHeaderCell: {
    borderBottom: '2px solid black',
    fontSize: '12px',
  },
  tableFooterCell: {
    borderTop: '2px solid black',
    borderBottom: 0,
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
    fontSize: '12px',
  },
  labelWrapp: {
    background: 'linear-gradient(121deg, #073b65 38%, #0079ae)',
    padding: '8px',
    marginBottom: '8px',
    color: 'white',
    textAlign: 'center',
  },
});

const RunningTally = (props: IProps) => {
  const { teams, games, showNames } = props;
  const classes = useStyles();

  const dataForTable: ITableRunningTally<string>[] = [];
  let totalCount = 0;
  (teams || []).map(team => {
    let countAllGames = 0;
    let countHomeGames = 0;
    let countAwayGames = 0;
    games.map((game: IGameCell) => {
      if (game.awayTeamId === team.team_id) {
        countAllGames++;
        countAwayGames++;
      }
      if (game.homeTeamId === team.team_id) {
        countAllGames++;
        countHomeGames++;
      }
    });
    totalCount += countAllGames;
    dataForTable.push({
      team_id: team.team_id,
      team_name: team.short_name,
      count_of_home_games: countHomeGames,
      count_of_away_games: countAwayGames,
      count_of_all_games: countAllGames,
    } as ITableRunningTally<string>);
  });

  return (
    <div>
      <div className={classes.labelWrapp}> Running Tally of Games </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table size="small" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} align="center">
                Team
              </TableCell>
              <TableCell className={classes.tableHeaderCell} align="center">
                Home
              </TableCell>
              <TableCell className={classes.tableHeaderCell} align="center">
                Away
              </TableCell>
              <TableCell className={classes.tableHeaderCell} align="center">
                Count
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataForTable.map(row => {
              const index = teams!.findIndex(o => o.team_id === row.team_id);
              return (
                <TableRow key={row.team_name}>
                  <TableCell className={classes.tableTeamCell} align="center">
                    {showNames ? (
                      row.team_name
                    ) : (
                      <p title={row.team_name}>{index + 1}</p>
                    )}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    {row.count_of_home_games}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    {row.count_of_away_games}
                  </TableCell>
                  <TableCell className={classes.tableCountCell} align="center">
                    {row.count_of_all_games}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                className={classes.tableFooterCell}
                align="right"
                colSpan={4}
              >
                Total: {totalCount}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RunningTally;
