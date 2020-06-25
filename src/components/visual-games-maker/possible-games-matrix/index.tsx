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
import { IGameCell } from '../helpers';

interface IProps {
  games: IGameCell[];
  teams: ITeam[] | undefined;
  poolId: string;
  divisionId: string;
  divisionHex: string;
  divisionName: string;
  onChangeGames: (a: IGameCell[]) => void;
}

const useStyles = makeStyles({
  tableContainer: {
    overflow: 'hidden',
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
  const { games, teams, poolId, divisionId, divisionHex, divisionName, onChangeGames } = props;
  const classes = useStyles();

  const onAddGame = (item: IGameCell) => {
    onChangeGames([...games, item]);
  };

  const onDeleteGame = (item: IGameCell) => {
    const newGames = games.filter(
      game =>
        game.divisionId !== item.divisionId ||
        game.awayTeamId !== item.awayTeamId ||
        game.homeTeamId !== item.homeTeamId
    );
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
                <TableCell
                  className={classes.homeWrapp}
                  colSpan={(teams || []).length + 1}
                  align="center"
                >
                  Home
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className={classes.awayWrapp}
                  rowSpan={(teams || []).length + 1}
                  align="center"
                >
                  <p className={classes.awayTextWrapp}>Away</p>
                </TableCell>
                <TableCell className={classes.tableTeamLeftCell} align="center">
                  Team
                </TableCell>
                {teams!.map((team, index) => {
                  if (!(team.pool_id === poolId) && !(poolId === 'allPools')) {
                    return;
                  }
                  return (
                    <TableCell
                      key={team.team_id}
                      className={classes.tableTeamCell}
                      align="center"
                    >
                      <p title={team.short_name}>{index + 1}</p>
                    </TableCell>
                  );
                })}
              </TableRow>
              {teams!.map((team, index) => (
                <TableRow key={team.team_id}>
                  <TableCell
                    style={{
                      display:
                        poolId === team.pool_id || poolId === 'allPools'
                          ? 'table-cell'
                          : 'none',
                    }}
                    className={classes.tableTeamLeftCell}
                    align="center"
                  >
                    <p title={team.short_name}>{index + 1}</p>
                  </TableCell>
                  {teams!.map(homeTeam => (
                    <Cell
                      key={team.team_id + homeTeam.team_id}
                      awayTeamId={team.team_id}
                      homeTeamId={homeTeam.team_id}
                      divisionId={divisionId}
                      divisionHex={divisionHex}
                      divisionName={divisionName}
                      isShow={
                        (poolId === team.pool_id &&
                          poolId === homeTeam.pool_id) ||
                        poolId === 'allPools'
                      }
                      isSamePool={team.pool_id === homeTeam.pool_id}
                      isSelected={games.find(v => v.divisionId === divisionId && v.awayTeamId === team.team_id && v.homeTeamId === homeTeam.team_id) ? true : false}
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
