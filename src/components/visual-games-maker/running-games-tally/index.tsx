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
import { ITeam } from "common/models/teams";

interface ITableRunningTally<T> {
  team_index: number;
  team_name: T;
  count_of_home_games: number;
  count_of_away_games: number;
  count_of_all_games: number;
}

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
    border: '1px solid black',
    backgroundColor: 'rgb(235, 235, 235)',
    width: '20px',
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
});

const RunningTally = (props: IProps) => {
  const { teams, games, type } = props;
  const classes = useStyles();

  const dataForTable: ITableRunningTally<string>[] = [];
  let totalCount = 0;
  (teams || []).map((team, ind) => {
    let countAllGames = 0;
    let countHomeGames = 0;
    let countAwayGames = 0;
    games.map((game: IGame) => {
      if (game.away_game_id === ind + 1) {
        countAllGames++;
        countAwayGames++;
      }
      if (game.home_game_id === ind + 1) {
        countAllGames++;
        countHomeGames++;
      }
    });
    totalCount += countAllGames;
    dataForTable.push({
      team_index: ind,
      team_name: team.short_name,
      count_of_home_games: countHomeGames,
      count_of_away_games: countAwayGames,
      count_of_all_games: countAllGames,
    } as ITableRunningTally<string>);
  });

  return (
    <div>
      <div className={classes.labelWrapp}> Running Tally of Games </div>
      <TableContainer component={Paper}>
        <Table size="small">
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
            {dataForTable.map(row => (
              <TableRow key={row.team_name}>
                <TableCell className={classes.tableTeamCell} align="center">
                  {type === DisplayedLabelType.Index
                    ? row.team_index
                    : row.team_name}
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
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell className={classes.tableFooterCell} align="center">
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
