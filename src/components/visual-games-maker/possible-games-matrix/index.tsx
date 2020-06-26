import React from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core';
import Cell from '../cell';
import { ITeam, ISelectOption } from 'common/models';
import { IGameCell } from '../helpers';
import { sideBarsMatrixColor } from 'config/app.config';

interface IProps {
  games: IGameCell[];
  teams: ITeam[] | undefined;
  poolId: string;
  pools: ISelectOption[];
  showNames: boolean;
  divisionId: string;
  divisionHex: string;
  divisionName: string;
  onChangeGames: (a: IGameCell[]) => void;
}

const useStyles = makeStyles({
  tableContainer: {
    overflow: 'hidden',
  },
  tableCell: {
    border: '1px solid black',
    backgroundColor: 'rgb(235, 235, 235)',
    width: '20px',
  },
  tableTextCell: {
    whiteSpace: 'nowrap',
  },
  teamTextCell: {
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
  flexWrapp: {
    display: 'flex',
  },
  awayTextWrapp: {
    transform: 'rotate(-90deg)',
  },
  awayWrapp: {
    width: '20px',
    backgroundColor: sideBarsMatrixColor,
  },
  homeWrapp: {
    border: 0,
    padding: '8px',
    backgroundColor: sideBarsMatrixColor,
  },
  cellsWithNames: {
    verticalAlign: 'bottom',
    border: '1px solid black',
    backgroundColor: 'rgb(235, 235, 235)',
    width: '20px',
  },
  innercellsWithNames: {
    width: '20px',
    transform: 'rotate(180deg)',
    textAlign: 'right',
    padding: '7px 0',
    whiteSpace: 'nowrap',
    writingMode: 'vertical-lr',
  },
  hiddenCell: {
    display: 'none',
    visibility: 'hidden',
  },
  awayTeamCellWithNames: {
    textAlign: 'right',
    padding: '0 7px',
    border: '1px solid black',
    backgroundColor: 'rgb(235, 235, 235)',
  },
  pool: {
    border: '2px solid black',
    height: '20px',
    backgroundColor: sideBarsMatrixColor,
  },
  poolName: {
    whiteSpace: 'nowrap',
    writingMode: 'vertical-lr',
    transform: 'rotate(180deg)',
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
        borderBottom: 0,
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
  const {
    games,
    teams,
    poolId,
    pools,
    showNames,
    divisionId,
    divisionHex,
    divisionName,
    onChangeGames,
  } = props;
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

  let selectedPoolId = '';
  const isPoolCell = (team: ITeam) => {
    if (team.pool_id !== selectedPoolId && team.pool_id && poolId === 'allPools') {
      let count = 0;
      teams!.map(item => (item.pool_id === team.pool_id ? count++ : null));
      selectedPoolId = team.pool_id;
      const label = pools.find(pool => pool.value === team.pool_id)?.label;
      return (
        <TableCell className={classes.pool} rowSpan={count} align="center">
          <p className={classes.poolName}>{label}</p>
        </TableCell>
      );
    }
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
                <TableCell />
                {poolId === 'allPools' ? <TableCell /> : null}
                <TableCell
                  className={showNames ? classes.hiddenCell : classes.homeWrapp}
                  colSpan={(teams || []).length + 1}
                  align="center"
                >
                  Home
                </TableCell>
              </TableRow>
              <TableRow>
                {poolId === 'allPools' ? <TableCell /> : null}
                <TableCell className={showNames ? classes.hiddenCell : ''} />
                <TableCell className={classes.tableCell} align="center">
                  Team
                </TableCell>
                {teams!.map((team, index) => {
                  if (!(team.pool_id === poolId) && !(poolId === 'allPools')) {
                    return;
                  }
                  return (
                    <TableCell
                      key={team.team_id}
                      className={
                        showNames ? classes.cellsWithNames : classes.tableCell
                      }
                      align="center"
                    >
                      <p
                        title={team.short_name}
                        className={
                          showNames
                            ? classes.innercellsWithNames
                            : classes.tableTextCell
                        }
                      >
                        {showNames ? team.short_name : index + 1}
                      </p>
                    </TableCell>
                  );
                })}
              </TableRow>
              {teams!.map((team, index) => (
                <TableRow key={team.team_id}>
                  {index === 0 ? (
                    <TableCell
                      className={showNames ? classes.hiddenCell : classes.awayWrapp}
                      rowSpan={(teams || []).length + 1}
                      align="center"
                    >
                      <p className={classes.awayTextWrapp}>Away</p>
                    </TableCell>
                  ) : null}
                  {isPoolCell(team)}
                  <TableCell
                    style={{
                      display:
                        poolId === team.pool_id || poolId === 'allPools'
                          ? 'table-cell'
                          : 'none',
                    }}
                    className={
                      showNames
                        ? classes.awayTeamCellWithNames
                        : classes.tableCell
                    }
                    align="center"
                  >
                    <p
                      title={team.short_name}
                      className={classes.tableTextCell}
                    >
                      {showNames ? team.short_name : index + 1}
                    </p>
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
                      isSelected={
                        games.find(
                          v =>
                            v.divisionId === divisionId &&
                            v.awayTeamId === team.team_id &&
                            v.homeTeamId === homeTeam.team_id
                        )
                          ? true
                          : false
                      }
                      onAddGame={onAddGame}
                      onDeleteGame={onDeleteGame}
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </div>
  );
};

export default MatrixOfPossibleGames;
