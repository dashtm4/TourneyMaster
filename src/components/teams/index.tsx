import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { loadDivisions, loadPools, loadTeams } from './logic/actions';
import Navigation from './components/navigation';
import TeamManagement from './components/team-management';
import { HeadingLevelTwo } from '../common';
import { AppState } from './logic/reducer';
import { IDisision, IPool, ITeam } from '../../common/models';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  divisions: IDisision[];
  pools: IPool[];
  teams: ITeam[];
  loadDivisions: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
}

interface State {
  isEdit: boolean;
}

class Teams extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isEdit: false,
    };
  }

  componentDidMount() {
    const { loadDivisions } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadDivisions(eventId);
    }
  }

  onEditClick = () => this.setState(({ isEdit }) => ({ isEdit: !isEdit }));

  render() {
    const { divisions, pools, teams, loadPools, loadTeams } = this.props;
    const { isEdit } = this.state;

    return (
      <section>
        <Navigation
          isEdit={isEdit}
          onEditClick={this.onEditClick}
          history={this.props.history}
          eventId={this.props.match.params.eventId}
        />
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Teams</HeadingLevelTwo>
        </div>
        <ul className={styles.teamsList}>
          <TeamManagement
            divisions={divisions}
            pools={pools}
            teams={teams}
            loadPools={loadPools}
            loadTeams={loadTeams}
          />
        </ul>
      </section>
    );
  }
}

interface IRootState {
  teams: AppState;
}

export default connect(
  (state: IRootState) => ({
    divisions: state.teams.divisions,
    pools: state.teams.pools,
    teams: state.teams.teams,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadDivisions, loadPools, loadTeams }, dispatch)
)(Teams);
