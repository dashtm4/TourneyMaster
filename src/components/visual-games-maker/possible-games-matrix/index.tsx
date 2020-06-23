import React from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  makeStyles,
  TableFooter,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core';
import Cell from '../cell';
import { ITeam } from 'common/models';

interface IProps {
  games: IGame[];
  teams: ITeam[] | undefined;
  onChangeGames: (a: IGame[]) => void;
}

interface IGame {
  home_game_id: number;
  away_game_id: number;
}

const useStyles = makeStyles({
  tableContainer: {
    overflow: 'auto',
    height: '50vh',
  },
  tableTeamCell: {
    border: '1px solid black',
    backgroundColor: 'rgb(235, 235, 235)',
    width: '20px',
  },
  tableTeamLeftCell: {
    border: '1px solid black',
    backgroundColor: 'rgb(235, 235, 235)',
    width: '20px',
  },
  labelWrapp: {
    background: 'linear-gradient(121deg, #073b65 38%, #0079ae)',
    padding: '8px',
    marginBottom: '8px',
    color: 'white',
    textAlign: 'center',
  },
  tableHomeCell: {
    padding: 0,
    transform: 'rotate(-90deg)',
  },
  flexWrapp: {
    display: 'flex',
  },
  awayTextWrapp: {
    transform: 'rotate(-90deg)',
  },
  awayWrapp: {
    width: '20px',
    backgroundColor: 'rgb(226, 239, 218)',
  },
  homeWrapp: {
    border: 0,
    padding: '8px',
    backgroundColor: 'rgb(226, 239, 218)',
  },
});

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: 0,
        '&:last-child': {
          paddingRight: 0,
        },
      },
    },
    MuiTable: {
      root: {
        height: '100%',
        boxSizing: 'border-box',
      },
    },
  },
});

const MatrixOfPossibleGames = (props: IProps) => {
  const { games, teams, onChangeGames } = props;
  const classes = useStyles();

  const onAddGame = (item: IGame) => {
    onChangeGames([...games, item]);
  };

  const onDeleteGame = (item: IGame) => {
    const newGames = games.filter(game => (game.away_game_id !== item.away_game_id || game.home_game_id !== item.home_game_id));
    onChangeGames(newGames);
  };

  return (
    <div>
      <div className={classes.labelWrapp}> Matrix Of Possible Games </div>
      <ThemeProvider theme={theme}>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell />
                <TableCell className={classes.homeWrapp} colSpan={21} align="center"> Home </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.awayWrapp} rowSpan={21} align="center">
                  <p className={classes.awayTextWrapp}>Away</p>
                </TableCell>
                <TableCell className={classes.tableTeamLeftCell} align="center">
                  Team
                </TableCell>
                {teams &&
                  teams!.map((team, index) => (
                    <TableCell
                      key={team.team_id}
                      className={classes.tableTeamCell}
                      align="center"
                    >
                      <p title={team.short_name}>{index + 1}</p>
                    </TableCell>
                  ))}

              </TableRow>
              {teams &&
                teams.map((team, index) => (
                  <TableRow key={team.team_id}>
                    <TableCell
                      className={classes.tableTeamLeftCell}
                      align="center"
                    >
                      <p title={team.short_name}>{index + 1}</p>
                    </TableCell>
                    {teams &&
                      teams.map((homeTeam, homeIndex) => (
                        <Cell
                          key={homeTeam.team_id}
                          away_game_index={index + 1}
                          home_game_index={homeIndex + 1}
                          onAddGame={onAddGame}
                          onDeleteGame={onDeleteGame}
                        />
                    ))}
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ThemeProvider>

    </div>
  );
};

export default MatrixOfPossibleGames;
