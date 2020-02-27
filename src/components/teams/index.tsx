import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  loadDivisionsTeams,
  changePool,
  loadPools,
  editTeam,
  deleteTeam,
} from './logic/actions';
import Navigation from './components/navigation';
import TeamManagement from './components/team-management';
import PopupDeleteTeam from './components/popup-delete-team';
import { HeadingLevelTwo, Modal, PopupTeamEdit, Loader } from '../common';
import { AppState } from './logic/reducer';
import { IDisision, IPool, ITeam } from '../../common/models';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  divisions: IDisision[];
  pools: IPool[];
  teams: ITeam[];
  changePool: (
    team: ITeam,
    divisionId: string | null,
    poolId: string | null
  ) => void;
  loadDivisionsTeams: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  editTeam: (team: ITeam) => void;
  deleteTeam: (team: ITeam) => void;
}

interface State {
  configurableTeam: ITeam | null;
  currentDivision: string | null;
  currentPool: string | null;
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
      currentDivision: null,
      currentPool: null,
      isEdit: false,
      isEditPopupOpen: false,
      isDeletePopupOpen: false,
    };
  }

  componentDidMount() {
    const { loadDivisionsTeams } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadDivisionsTeams(eventId);
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

  onEditPopupOpen = (team: ITeam, divisionName: string, poolName: string) =>
    this.setState({
      isEditPopupOpen: true,
      configurableTeam: team,
      currentDivision: divisionName,
      currentPool: poolName,
    });

  onChangeTeam = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState(({ configurableTeam }) => ({
      configurableTeam: { ...(configurableTeam as ITeam), [name]: value },
    }));

  onSaveTeam = () => {
    const { configurableTeam } = this.state;
    const { editTeam } = this.props;

    if (configurableTeam) {
      editTeam(configurableTeam);
    }

    this.onCloseModal();
  };

  onCloseModal = () =>
    this.setState({
      configurableTeam: null,
      currentDivision: null,
      isEditPopupOpen: false,
      isDeletePopupOpen: false,
    });

  render() {
    const {
      isLoading,
      divisions,
      pools,
      teams,
      changePool,
      loadPools,
    } = this.props;

    const {
      configurableTeam,
      currentDivision,
      currentPool,
      isEdit,
      isEditPopupOpen,
      isDeletePopupOpen,
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <>
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
              isEdit={isEdit}
              changePool={changePool}
              loadPools={loadPools}
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
                division={currentDivision}
                pool={currentPool}
                onChangeTeam={this.onChangeTeam}
                onSaveTeamClick={this.onSaveTeam}
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
    isLoading: state.teams.isLoading,
    divisions: state.teams.divisions,
    pools: state.teams.pools,
    teams: state.teams.teams,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadDivisionsTeams, changePool, loadPools, editTeam, deleteTeam },
      dispatch
    )
)(Teams);
