import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ITeam, IDivision, IPool } from 'common/models';
import { IConfigurableSchedule } from 'common/models/schedule';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import styles from './styles.module.scss';
import RunningTally from "./running-games-tally";
import ResultingGameList from "./resulting-game-list";
import MatrixOfPossibleGames from "./possible-games-matrix";
import { Button } from 'components/common';
import History from 'browserhistory';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGameCell } from './helpers';
import { fillSchedulesTable } from 'components/schedules/logic/schedules-table/actions';
// import { ISchedulesTableState } from 'components/schedules/logic/schedules-table/schedulesTableReducer';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
  schedule?: IConfigurableSchedule | null | undefined;
}

export enum DisplayedLabelType {
  Index,
  Name,
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
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
  games: IGameCell[];
  teamCards: ITeamCard[];
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { teams } = this.props;
    this.state = {
      games: [],
      teamCards: teams!.map(v => ({
        id: v.team_id,
        name: v.short_name,
        startTime: '',
        poolId: v.pool_id,
        divisionId: v.division_id,
        isPremier: false,
        games: {}})) as ITeamCard[],
    };

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

  componentDidUpdate() {
    console.log(this.state.teamCards);
  }

  render() {
    const teams = this.props.teams && this.props.teams.filter(item => item.division_id === "ADRL2021" && item.pool_id === "ADRLPL21")
    const { schedule } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.tablesWrapper}>
          <div className={styles.runningTally}>
            <MatrixOfPossibleGames
              games={this.state.games}
              teams={teams}
              type={DisplayedLabelType.Index}
              onChangeGames={this.onChangeGames}
            />
          </div>
          <div className={styles.runningTally}>
            <RunningTally
              games={this.state.games}
              teams={teams}
              type={DisplayedLabelType.Name}
            />
          </div>
          <div className={styles.resGameList}>
            <ResultingGameList
              games={this.state.games}
              teams={teams}
              type={DisplayedLabelType.Name}
            />
          </div>
          <Button label="Next" color="primary" variant="contained" onClick={() => { 
            this.props.fillSchedulesTable(this.state.teamCards);
            History.push(`/schedules/${schedule!.event_id}`)
          }}>Next</Button>
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
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(mapStateToProps, mapDispatchToProps)(VisualGamesMaker);
