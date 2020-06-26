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
import { Button, Checkbox, Select } from 'components/common';
import History from 'browserhistory';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGameCell } from './helpers';
import { fillGamesList } from 'components/schedules/logic/schedules-table/actions';
import { IGame } from 'components/common/matrix-table/helper';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
  schedule?: IConfigurableSchedule | null | undefined;
  teamsCards?: ITeamCard[] | undefined;
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
  fillGamesList: (gamesList: IGame[]) => void;
}

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IComponentProps {}

interface IRootState {
  pageEvent?: IPageEventState;
  divisions?: IDivisionAndPoolsState;
  scheduling?: ISchedulingState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {
  isShowNamesOfTeams: boolean;
  games: IGameCell[];
  selectedDivisionId: string;
  selectedPoolId: string;
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      games: [],
      isShowNamesOfTeams: false,
      selectedDivisionId: '',
      selectedPoolId: 'allPools',
    };
  }

  componentDidMount() {
    const { divisions, getAllPools } = this.props;

    this.setState({
      selectedDivisionId: (divisions && divisions[0].division_id) || '',
    });

    getAllPools(divisions!.map(v => v.division_id));
  }

  onChangeGames = (items: IGameCell[]) => {
    this.setState({
      games: items,
    });
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
    const { schedule, fillGamesList } = this.props;

    const gamesList = this.state.games.map(v => {
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
    fillGamesList(gamesList);
    History.push(`/schedules/${schedule?.event_id}`)
  };

  onCancelClick = () => History.goBack();

  render() {
    const filteredTeams = this.props.teams!.filter(
      item => item.division_id === this.state.selectedDivisionId
    );
    const sortedTeams = filteredTeams.sort((a: ITeam, b: ITeam) => {
      return (a.pool_id || '') > (b.pool_id || '') ? 1 : -1;
    });

    const filteredGames = this.state.games!.filter(
      item => item.divisionId === this.state.selectedDivisionId
    );

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
              games={this.state.games}
              teams={sortedTeams}
              poolId={this.state.selectedPoolId}
              showNames={this.state.isShowNamesOfTeams}
              divisionId={this.state.selectedDivisionId}
              divisionHex={this.props.divisions?.find(v => v.division_id === this.state.selectedDivisionId)?.division_hex || ''}
              divisionName={this.props.divisions?.find(v => v.division_id === this.state.selectedDivisionId)?.short_name || ''}
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
          <div className={styles.buttonsWrapp}>
            <div className={styles.cancelButton}>
              <Button
                label="Cancel"
                color="secondary"
                variant="text"
                onClick={this.onCancelClick}
              />
            </div>
            <Button
              label="Next"
              color="primary"
              variant="contained"
              onClick={this.createScheduleTable}
            />
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
