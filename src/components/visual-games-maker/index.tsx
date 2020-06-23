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

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
  schedule?: IConfigurableSchedule | null | undefined;
  // history: History;
}

export interface IGame {
  home_game_id: number;
  away_game_id: number;
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
}

interface IComponentProps {}

interface IRootState {
  pageEvent?: IPageEventState;
  divisions?: IDivisionAndPoolsState;
  scheduling?: ISchedulingState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {
  games: IGame[];
  isShowNamesOfTeams: boolean;
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      games: [],
      isShowNamesOfTeams: false,
    };
  }

  componentDidMount() {
    const { divisions, getAllPools } = this.props;

    getAllPools(divisions!.map(v => v.division_id));
  }

  onChangeGames = (items: IGame[]) => {
    this.setState({
      games: items,
    });
  };

  onChangeDisplayedLabelType = () => {
    this.setState((state: IState) => {
      return { isShowNamesOfTeams: !state.isShowNamesOfTeams };
    });
  };

  render() {
    const teams = this.props.teams && this.props.teams.filter(item => item.division_id === 'ADRL2021')
    const { schedule } = this.props;
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
            <Button
              label='Next'
              color='primary'
              variant='contained'
              onClick={() => History.push(`/schedules/${schedule!.event_id}`)}
            >
              Next
            </Button>
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
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(mapStateToProps, mapDispatchToProps)(VisualGamesMaker);
