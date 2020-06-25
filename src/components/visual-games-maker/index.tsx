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
import {
  fillSchedulesTable,
  fillGamesList,
} from 'components/schedules/logic/schedules-table/actions';
import { IGame } from 'components/common/matrix-table/helper';
import { TeamPositionEnum } from 'components/common/matrix-table/helper';

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
  teamCards: ITeamCard[];
  selectedDivisionId: string;
  selectedPoolId: string;
}

class VisualGamesMaker extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { teams } = this.props;
    this.state = {
      games: [],
      isShowNamesOfTeams: false,
      selectedDivisionId: '',
      selectedPoolId: 'allPools',
      teamCards: teams!.map(v => ({
        id: v.team_id,
        name: v.short_name,
        startTime: '',
        poolId: v.pool_id,
        divisionId: v.division_id,
        isPremier: false,
        games: {},
      })) as ITeamCard[],
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

    const teamCards = this.state.teamCards;
    const games = items;
    const updatedTeamCards = teamCards.map(v => {
      let newGames = [];
      newGames = games
        .filter(game => game.homeTeamId === v.id)
        .map(homeGame => ({
          id: homeGame.gameId,
          teamPosition: TeamPositionEnum.homeTeam,
        }));
      newGames.concat(
        games
          .filter(game => game.awayTeamId === v.id)
          .map(awayGame => ({
            id: awayGame.gameId,
            teamPosition: TeamPositionEnum.awayTeam,
          }))
      );
      return { ...v, games: newGames};
    });

    this.setState({ teamCards: updatedTeamCards });
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
      games: [],
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
    const pools = (this.props.pools || [])
      .filter(pool => pool.division_id === this.state.selectedDivisionId)
      .map(pool => {
        return {
          value: pool.pool_id,
          label: pool.pool_name,
        };
      });
    return [firstOption, ...pools];
  };

  createScheduleTable = () => {
    const { schedule, fillSchedulesTable, fillGamesList } = this.props;
    fillSchedulesTable(this.state.teamCards);

    const gamesList = this.state.games.map(v => {
      const homeTeam = this.state.teamCards.find(teamCard => teamCard.id === v.homeTeamId);
      const awayTeam = this.state.teamCards.find(teamCard => teamCard.id === v.awayTeamId);
      return {
        id: v.gameId,
        homeTeamId: homeTeam?.id,
        homeDisplayName: homeTeam?.name,
        homeTeam: homeTeam,
        awayTeamId: awayTeam?.id,
        awayDisplayName: awayTeam?.name,
        awayTeam: awayTeam,
        timeSlotId: 0,
        fieldId: '',
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
              onChangeGames={this.onChangeGames}
            />
          </div>
          <div className={styles.sideTables}>
            <div className={styles.runningTally}>
              <RunningTally
                games={this.state.games}
                teams={sortedTeams}
                showNames={this.state.isShowNamesOfTeams}
              />
            </div>
            <div className={styles.resGameList}>
              <ResultingGameList
                games={this.state.games}
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
      fillSchedulesTable,
      fillGamesList,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(VisualGamesMaker);
