import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ITeam, IDivision, IPool } from 'common/models';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import RunningGamesTally from './running-games-tally';
import ResultingGamesList from './resulting-game-list';
import PossibleGamesMatrix from './possible-games-matrix';
import styles from './styles.module.scss';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
  divisions?: IDivision[] | undefined;
  pools?: IPool[] | undefined;
}

interface IMapDispatchToProps {
  getAllPools: (divisionIds: string[]) => void;
}

interface IComponentProps {}

interface IRootState {
  pageEvent?: IPageEventState;
  divisions?: IDivisionAndPoolsState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {}

class VisualGamesMaker extends Component<IProps, IState> {
  componentDidMount() {
    const { divisions, getAllPools } = this.props;

    getAllPools(divisions!.map(v => v.division_id));
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.tablesWrapper}>
          <PossibleGamesMatrix />
          <RunningGamesTally />
          <ResultingGamesList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  divisions,
}: IRootState): IMapStateToProps => ({
  teams: pageEvent?.tournamentData.teams,
  divisions: pageEvent?.tournamentData.divisions,
  pools: divisions?.pools,
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps =>
  bindActionCreators(
    {
      getAllPools,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(mapStateToProps, mapDispatchToProps)(VisualGamesMaker);
