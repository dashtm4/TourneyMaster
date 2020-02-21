import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  loadDivisions,
  loadPools,
  loadTeams,
  changePool,
  deleteTeam,
} from './logic/actions';
import Navigation from './components/navigation';
import TeamManagement from './components/team-management';
import PopupDeleteTeam from './components/popup-delete-team';
import { HeadingLevelTwo, Modal, PopupTeamEdit } from '../common';
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
  deleteTeam: (team: ITeam) => void;
}

interface State {
  configurableTeam: ITeam | null;
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
      configurableTeam: null,
      isEdit: true,
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

  onDeletePopupOpen = (team: ITeam) =>
    this.setState({ configurableTeam: team, isDeletePopupOpen: true });

  onDeleteTeam = (team: ITeam) => {
    const { deleteTeam } = this.props;

    deleteTeam(team);

    this.onCloseModal();
  };

  onEditPopupOpen = (team: ITeam) =>
    this.setState({ configurableTeam: team, isEditPopupOpen: true });

  onChangeTeam = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState(({ configurableTeam }) => ({
      configurableTeam: { ...(configurableTeam as ITeam), [name]: value },
    }));

  onCloseModal = () =>
    this.setState({
      configurableTeam: null,
      isEditPopupOpen: false,
      isDeletePopupOpen: false,
    });

  render() {
    const { divisions, pools, teams, changePool } = this.props;
    const {
      configurableTeam,
      isEdit,
      isEditPopupOpen,
      isDeletePopupOpen,
    } = this.state;

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
              onDeletePopupOpen={this.onDeletePopupOpen}
              onEditPopupOpen={this.onEditPopupOpen}
            />
          </ul>
        </section>
        <Modal
          isOpen={isDeletePopupOpen || isEditPopupOpen}
          onClose={this.onCloseModal}
        >
          <>
            {isEditPopupOpen && (
              <PopupTeamEdit
                team={configurableTeam}
                onChangeTeam={this.onChangeTeam}
                onSaveTeamClick={() => {}}
                onDeleteTeamClick={this.onDeleteTeam}
                onCloseModal={this.onCloseModal}
              />
            )}
            {isDeletePopupOpen && (
              <PopupDeleteTeam
                team={configurableTeam}
                onCloseModal={this.onCloseModal}
                onDeleteClick={this.onDeleteTeam}
              />
            )}
          </>
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
      { loadDivisions, loadPools, loadTeams, changePool, deleteTeam },
      dispatch
    )
)(Teams);
