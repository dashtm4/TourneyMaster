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
import Cell from "../cell";
import { ITeam } from "common/models";
import { IGameCell } from '../helpers';

interface IProps {
  games: IGameCell[];
  teams: ITeam[] | undefined;
  type: number;
  onChangeGames: (a: IGameCell[]) => void;
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
    border: '1px solid black',
  },
  tableHeaderCell: {
    border: 0,
    padding: 0,
    backgroundColor: '#B6FFC4',
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
  tableHomeCell: {
    padding: 0,
    transform: 'rotate(-90deg)',
  },
});

const MatrixOfPossibleGames = (props: IProps) => {
  const { games, teams, type, onChangeGames } = props;
  const classes = useStyles();
  // const [gameIdentity, setGameIdentity] = useState(1);
  let gameIdentity = 1;

  const onAddGame = (item: IGameCell) => {
    onChangeGames([...games, item]);
  };

  const onDeleteGame = (item: IGameCell) => {
    const newGames = games.filter(game => (game.awayTeamId !== item.awayTeamId || game.homeTeamId !== item.homeTeamId));
    onChangeGames(newGames);
  };

  return (
    <div>
      <div className={classes.labelWrapp}> Matrix Of Possible Games </div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell
                className={classes.tableHeaderCell}
                align="center"
                colSpan={teams && teams.length + 1}
              >
                Away
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                className={classes.tableHeaderCell}
                align="center"
                rowSpan={teams && teams.length + 2}
              >
                <p className={classes.tableHomeCell}> Home </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableTeamCell} align="center">
                Team
              </TableCell>
              {teams &&
                teams!.map((team, index) => (
                  <TableCell
                    key={team.team_id}
                    className={classes.tableTeamCell}
                    align="center"
                  >
                    {type === DisplayedLabelType.Index ? index + 1 : team.short_name}
                  </TableCell>
                ))}
            </TableRow>
            {teams &&
              teams.map((team, index) => (
                <TableRow key={team.team_id}>
                  <TableCell className={classes.tableTeamCell} align="center">
                    {type === DisplayedLabelType.Index ? index + 1 : team.short_name}
                  </TableCell>
                  {teams && teams.map((homeTeam) => (
                    <Cell
                      key={gameIdentity}
                      gameId={gameIdentity++}
                      awayTeamId={team.team_id}
                      homeTeamId={homeTeam.team_id}
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
    </div>
  );
};

export default MatrixOfPossibleGames;
