import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ITeam, IDivision, IPool } from 'common/models';
import { IConfigurableSchedule } from 'common/models/schedule';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import styles from './styles.module.scss';
import RunningTally from './running-games-tally';
import ResultingGameList from './resulting-game-list';
import MatrixOfPossibleGames from './possible-games-matrix';
import { Button, Checkbox } from 'components/common';
import History from 'browserhistory';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGameCell } from './helpers';
import { fillSchedulesTable, fillGamesList } from 'components/schedules/logic/schedules-table/actions';
import { IGame } from 'components/common/matrix-table/helper';
// import { ISchedulesTableState } from 'components/schedules/logic/schedules-table/schedulesTableReducer';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
  schedule?: IConfigurableSchedule | null | undefined;
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  fillGamesList: (gamesList: IGame[]) => void;
}

interface IComponentProps {}

interface IRootState {
  pageEvent?: IPageEventState;
  divisions?: IDivisionAndPoolsState;
  scheduling?: ISchedulingState;
  // schedulesTable: ISchedulesTableState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {
  isShowNamesOfTeams: boolean;
  games: IGameCell[];
  teamCards: ITeamCard[];
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { teams } = this.props;
    this.state = {
      games: [],
      isShowNamesOfTeams: false,
      teamCards: teams!.filter(v => v.division_id === 'ADRL2021').map(v => ({
        id: v.team_id,
        name: v.short_name,
        startTime: '',
        poolId: v.pool_id,
        divisionId: v.division_id,
        isPremier: false,
        games: {}})) as ITeamCard[],
    };
    this.createScheduleTable = this.createScheduleTable.bind(this);

    console.log('this.state', this.state);
  }

  componentDidMount() {
    const { divisions, getAllPools } = this.props;

    getAllPools(divisions!.map(v => v.division_id));
  }

  onChangeGames = (items: IGameCell[]) => {
    console.log('items', items);
    this.setState({
      games: items,
    });

    const teamCards = this.state.teamCards;
    const games = this.state.games;
    const updatedTeamCards = teamCards.map(v => {
      let newGames = [];
      newGames = games.filter(game => game.homeTeamId === v.id).map(homeGame => ({ id: homeGame.gameId, teamPosition: 2}))
      newGames.concat(games.filter(game => game.awayTeamId === v.id).map(awayGame => ({ id: awayGame.gameId, teamPosition: 1})));
      return { ...v, games: newGames};
    });

    this.setState({ teamCards: updatedTeamCards});

    // this.props.fillSchedulesTable(this.state.teamCards);
  };

  onChangeDisplayedLabelType = () => {
    this.setState((state: IState) => {
      return { isShowNamesOfTeams: !state.isShowNamesOfTeams };
    });
  };
  componentDidUpdate() {
    console.log(this.state.teamCards);
  }

  createScheduleTable() { 
    const { schedule, fillSchedulesTable, fillGamesList } = this.props;
    fillSchedulesTable(this.state.teamCards);

    const gamesList = this.state.games.map(v => {
      const homeTeam = this.state.teamCards.find(teamCard => teamCard.id === v.homeTeamId);
      const awayTeam = this.state.teamCards.find(teamCard => teamCard.id === v.awayTeamId);
      return { id: v.gameId,
        homeTeamId: homeTeam?.id, homeDisplayName: homeTeam?.name, homeTeam: homeTeam,
        awayTeamId: awayTeam?.id, awayDisplayName: awayTeam?.name, awayTeam: awayTeam,
        timeSlotId: 0, fieldId: ''};
    });
    console.log('games list', gamesList);
    fillGamesList(gamesList);
    History.push(`/schedules/${schedule?.event_id}`)
  }

  render() {
    const teams = this.props.teams && this.props.teams.filter(item => item.division_id === 'ADRL2021')

    return (
      <div className={styles.container}>
        <div className={styles.checkboxWrapp}>
          <Checkbox
            options={[{ label: 'Show Names of Teams', checked: this.state.isShowNamesOfTeams }]}
            onChange={this.onChangeDisplayedLabelType}
          />
        </div>

        <div className={styles.tablesWrapper}>

          <div className={styles.matrixOfPossibleGames}>
            <MatrixOfPossibleGames
              games={this.state.games}
              teams={teams}
              onChangeGames={this.onChangeGames}
            />
          </div>
          <div className={styles.runningTally}>
            <RunningTally
              games={this.state.games}
              teams={teams}
              showNames={this.state.isShowNamesOfTeams}
            />
          </div>
          <div className={styles.resGameList}>
            <ResultingGameList
              games={this.state.games}
              teams={teams}
              showNames={this.state.isShowNamesOfTeams}
            />
          </div>
          <div className={styles.button}>
            <Button label="Next" color="primary" variant="contained" onClick={this.createScheduleTable}>Next</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  divisions,
  scheduling,
}: IRootState): IMapStateToProps => ({
  teams: pageEvent?.tournamentData.teams,
  divisions: pageEvent?.tournamentData.divisions,
  pools: divisions?.pools,
  schedule: scheduling?.schedule,
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps =>
  bindActionCreators(
    {
      getAllPools,
      fillSchedulesTable,
      fillGamesList,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(mapStateToProps, mapDispatchToProps)(VisualGamesMaker);
