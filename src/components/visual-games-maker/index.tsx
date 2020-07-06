import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ITeam, IDivision, IPool } from 'common/models';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import styles from './styles.module.scss';
import RunningTally from './running-games-tally';
import ResultingGameList from './resulting-game-list';
import MatrixOfPossibleGames from './possible-games-matrix';
import { Checkbox, Select } from 'components/common';
import { ITeamCard } from 'common/models/schedule/teams';
import { IMatchup, IMatchupTeam } from './helpers';
import { fillGamesList } from 'components/schedules/logic/schedules-table/actions';
import { IConfigurableGame } from 'components/common/matrix-table/helper';
import { ISchedulesTableState } from 'components/schedules/logic/schedules-table/schedulesTableReducer';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
  teamsCards?: ITeamCard[] | undefined;
  gamesList?: IConfigurableGame[] | undefined;
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
  fillGamesList: (gamesList: IConfigurableGame[]) => void;
}

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IComponentProps {
  gamesCells: IMatchup[];
  onGamesListChange: (item: IMatchup[]) => void;
  showTeamsNames: boolean;
  toggleShowTeamsNames: () => void;
}

interface IRootState {
  pageEvent?: IPageEventState;
  divisions?: IDivisionAndPoolsState;
  schedulesTable?: ISchedulesTableState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {
  selectedDivisionId: string;
  selectedPoolId: string;
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
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

  onChangeGames = (items: IMatchup[]) => {
    this.props.onGamesListChange(items);
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

  getFilteredAndSortedTeams = (): IMatchupTeam[] => {
    const filteredTeams = this.props
      .teams!.filter(item => item.division_id === this.state.selectedDivisionId)
      .map(
        t =>
          ({
            id: t.team_id,
            name: t.short_name,
            poolId: t.pool_id === null ? '' : t.pool_id,
          } as IMatchupTeam)
      );

    return filteredTeams.sort((a: IMatchupTeam, b: IMatchupTeam) => {
      // sort by pool
      if (a.poolId > b.poolId) {
        return 1;
      } else if (a.poolId < b.poolId) {
        return -1;
      }

      // then by name
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  render() {
    const sortedTeams = this.getFilteredAndSortedTeams();

    const filteredGames = this.props.gamesCells.filter(
      item => item.divisionId === this.state.selectedDivisionId
    );

    const { showTeamsNames, toggleShowTeamsNames } = this.props;

    return (
      <section className={styles.section}>
        <div className={styles.container}>
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
                    checked: showTeamsNames,
                  },
                ]}
                onChange={toggleShowTeamsNames}
              />
            </div>
          </div>
          <div className={styles.tablesWrapper}>
            <div className={styles.matrixOfPossibleGames}>
              <MatrixOfPossibleGames
                games={this.props.gamesCells}
                teams={sortedTeams}
                poolId={this.state.selectedPoolId}
                showNames={showTeamsNames}
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
            <div className={styles.runningTally}>
              <RunningTally
                games={filteredGames}
                teams={sortedTeams}
                showNames={showTeamsNames}
              />
            </div>
            <div className={styles.resGameList}>
              <ResultingGameList
                games={filteredGames}
                teams={sortedTeams}
                showNames={showTeamsNames}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  divisions,
  schedulesTable,
}: IRootState): IMapStateToProps => ({
  teams: pageEvent?.tournamentData.teams,
  divisions: pageEvent?.tournamentData.divisions,
  pools: divisions?.pools,
  gamesList: schedulesTable?.gamesList,
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
