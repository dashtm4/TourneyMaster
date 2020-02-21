import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  loadDivisions,
  loadPools,
  loadTeams,
  changePool,
} from './logic/actions';
import Navigation from './components/navigation';
import TeamManagement from './components/team-management';
import { HeadingLevelTwo, Modal } from '../common';
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
  changePool: (team: ITeam, poolId: string | null) => void;
}

interface State {
  isEdit: boolean;
  isEditPopupOpen: boolean;
  isDeletePopupOpen: boolean;
}

class Teams extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isEdit: false,
      isEditPopupOpen: false,
      isDeletePopupOpen: false,
    };
  }

  componentDidMount() {
    const { loadDivisions, loadPools, loadTeams } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadDivisions(eventId);
      loadTeams(eventId);
      loadPools(eventId);
    }
  }

  onEditClick = () => this.setState(({ isEdit }) => ({ isEdit: !isEdit }));

  onCloseModal = () =>
    this.setState({ isEditPopupOpen: false, isDeletePopupOpen: false });

  render() {
    const { divisions, pools, teams, changePool } = this.props;
    const { isEdit, isDeletePopupOpen } = this.state;

    return (
      <>
        <section>
          <Navigation isEdit={isEdit} onEditClick={this.onEditClick} />
          <div className={styles.headingWrapper}>
            <HeadingLevelTwo>Teams</HeadingLevelTwo>
          </div>
          <ul className={styles.teamsList}>
            <TeamManagement
              divisions={divisions}
              pools={pools}
              teams={teams}
              isEdit={isEdit}
              changePool={changePool}
            />
          </ul>
        </section>
        <Modal isOpen={isDeletePopupOpen} onClose={this.onCloseModal}>
          <div>{isDeletePopupOpen && <p>asd</p>}</div>
        </Modal>
      </>
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
    bindActionCreators(
      { loadDivisions, loadPools, loadTeams, changePool },
      dispatch
    )
)(Teams);
