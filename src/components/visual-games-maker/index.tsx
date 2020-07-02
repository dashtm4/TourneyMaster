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
import { Checkbox, Select } from 'components/common';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGameCell } from './helpers';
import { fillGamesList } from 'components/schedules/logic/schedules-table/actions';
import { IConfigurableGame } from 'components/common/matrix-table/helper';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
  schedule?: IConfigurableSchedule | null | undefined;
  teamsCards?: ITeamCard[] | undefined;
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
  fillGamesList: (gamesList: IConfigurableGame[]) => void;
}

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IComponentProps {
  gamesCells?: IGameCell[];
  onGamesListChange: (item: IGameCell[]) => void;
}

interface IRootState {
  pageEvent?: IPageEventState;
  divisions?: IDivisionAndPoolsState;
  scheduling?: ISchedulingState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {
  isShowNamesOfTeams: boolean;
  selectedDivisionId: string;
  selectedPoolId: string;
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isShowNamesOfTeams: false,
      selectedDivisionId: '',
      selectedPoolId: 'allPools',
    };
  }

  componentDidMount() {
    const { divisions } = this.props;
    this.setState({
      selectedDivisionId: (divisions && divisions[0].division_id) || '',
    });
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.gamesCells !== prevProps.gameCells) {
      this.createScheduleTable();
    }
  }
  onChangeGames = (items: IGameCell[]) => {
    const { onGamesListChange } = this.props;
    onGamesListChange(items);
  };
  onChangeDisplayedLabelType = () => {
    this.setState((state: IState) => {
      return { isShowNamesOfTeams: !state.isShowNamesOfTeams };
    });
  };

  onChangeDivision = (e: InputTargetValue) => {
    const divisionIdFromInput = e.target.value;
    this.setState({
      selectedDivisionId: divisionIdFromInput,
      selectedPoolId: 'allPools',
    });
  };

  onChangePool = (e: InputTargetValue) => {
    const poolIdFromInput = e.target.value;
    this.setState({
      selectedPoolId: poolIdFromInput,
    });
  };

  mapOptionsForPools = () => {
    const firstOption = { value: 'allPools', label: 'All pools' };
    const currentPools = (this.props.pools || [])
      .filter(pool => pool.division_id === this.state.selectedDivisionId)
      .map(pool => {
        return {
          value: pool.pool_id,
          label: pool.pool_name,
        };
      });
    return [firstOption, ...currentPools];
  };

  createScheduleTable = () => {
    const { fillGamesList, gamesCells } = this.props;
    if (!gamesCells) return;
    const gamesListMaker = gamesCells.map(v => {
      return {
        id: -1,
        homeTeamId: v.homeTeamId,
        awayTeamId: v.awayTeamId,
        timeSlotId: 0,
        fieldId: '',
        divisionId: v.divisionId,
        divisionHex: v.divisionHex,
        divisionName: v.divisionName,
      };
    });
    fillGamesList(gamesListMaker);
  };

  render() {
    const filteredTeams = this.props.teams!.filter(
      item => item.division_id === this.state.selectedDivisionId
    );
    const sortedTeams = filteredTeams.sort((a: ITeam, b: ITeam) => {
      return (a.pool_id || '') > (b.pool_id || '') ? 1 : -1;
    });

    const filteredGames = this.props.gamesCells?.filter(
      item => item.divisionId === this.state.selectedDivisionId
    ) || [];

    return (
      <div className={styles.container}>
        <h1> Visual Games Maker </h1>
        <div className={styles.filterWrapp}>
          <div className={styles.divisionWrapp}>
            <h3> Division: </h3>
            <div className={styles.selectWrapp}>
              <Select
                value={this.state.selectedDivisionId}
                options={(this.props.divisions || []).map(division => {
                  return {
                    value: division.division_id,
                    label: division.short_name,
                  };
                })}
                onChange={this.onChangeDivision}
              />
            </div>
          </div>
          <div className={styles.divisionWrapp}>
            <h3> Pool: </h3>
            <div className={styles.selectWrapp}>
              <Select
                value={this.state.selectedPoolId}
                options={this.mapOptionsForPools()}
                onChange={this.onChangePool}
              />
            </div>
          </div>
          <div className={styles.checkboxWrapp}>
            <Checkbox
              options={[
                {
                  label: 'Show Names of Teams',
                  checked: this.state.isShowNamesOfTeams,
                },
              ]}
              onChange={this.onChangeDisplayedLabelType}
            />
          </div>
        </div>
        <div className={styles.tablesWrapper}>
          <div className={styles.matrixOfPossibleGames}>
            <MatrixOfPossibleGames
              games={this.props.gamesCells || []}
              teams={sortedTeams}
              poolId={this.state.selectedPoolId}
              showNames={this.state.isShowNamesOfTeams}
              divisionId={this.state.selectedDivisionId}
              divisionHex={
                this.props.divisions?.find(
                  v => v.division_id === this.state.selectedDivisionId,
                )?.division_hex || ''
              }
              divisionName={
                this.props.divisions?.find(
                  v => v.division_id === this.state.selectedDivisionId,
                )?.short_name || ''
              }
              onChangeGames={this.onChangeGames}
              pools={this.mapOptionsForPools()}
            />
          </div>
          <div className={styles.sideTables}>
            <div className={styles.runningTally}>
              <RunningTally
                games={filteredGames}
                teams={sortedTeams}
                showNames={this.state.isShowNamesOfTeams}
              />
            </div>
            <div className={styles.resGameList}>
              <ResultingGameList
                games={filteredGames}
                teams={sortedTeams}
                showNames={this.state.isShowNamesOfTeams}
              />
            </div>
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
      fillGamesList,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(VisualGamesMaker);
