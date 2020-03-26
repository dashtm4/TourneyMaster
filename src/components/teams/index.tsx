import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { loadDivisionsTeams, loadPools, saveTeams } from './logic/actions';
import Navigation from './components/navigation';
import TeamManagement from './components/team-management';
import PopupDeleteTeam from './components/popup-delete-team';
import {
  HeadingLevelTwo,
  Modal,
  PopupTeamEdit,
  Loader,
  PopupExposure,
} from 'components/common';
import { AppState } from './logic/reducer';
import { IDivision, IPool, ITeam } from '../../common/models';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  loadDivisionsTeams: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  saveTeams: (teams: ITeam[]) => void;
}

interface State {
  teams: ITeam[];
  configurableTeam: ITeam | null;
  currentDivision: string | null;
  currentPool: string | null;
  isEdit: boolean;
  isEditPopupOpen: boolean;
  isDeletePopupOpen: boolean;
  isConfirmModalOpen: boolean;
}

class Teams extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      teams: [],
      configurableTeam: null,
      currentDivision: null,
      currentPool: null,
      isEdit: false,
      isEditPopupOpen: false,
      isDeletePopupOpen: false,
      isConfirmModalOpen: false,
    };
  }

  componentDidMount() {
    const { loadDivisionsTeams } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadDivisionsTeams(eventId);
    }
  }

  componentDidUpdate(PrevProps: Props) {
    const { isLoading, teams } = this.props;

    if (PrevProps.isLoading !== isLoading) {
      this.setState({ teams: teams });
    }
  }

  changePool = (
    team: ITeam,
    divisionId: string | null,
    poolId: string | null
  ) => {
    const changedTeam = {
      ...team,
      division_id: divisionId,
      pool_id: poolId,
      isChange: true,
    };

    this.setState(({ teams }) => ({
      teams: teams.map(it =>
        it.team_id === changedTeam.team_id ? changedTeam : it
      ),
    }));
  };

  onEditClick = () => this.setState(({ isEdit }) => ({ isEdit: !isEdit }));

  onSaveClick = () => {
    const eventId = this.props.match.params.eventId;
    const { saveTeams } = this.props;
    const { teams } = this.state;

    if (eventId) {
      saveTeams(teams);
    }
    this.setState({ isConfirmModalOpen: false, isEdit: false });
  };

  onCancelClick = () => {
    const { teams } = this.props;

    this.setState({ isEdit: false, teams, isConfirmModalOpen: false });
  };

  onDeletePopupOpen = (team: ITeam) =>
    this.setState({ configurableTeam: team, isDeletePopupOpen: true });

  onDeleteTeam = (team: ITeam) => {
    this.setState(({ teams }) => ({
      teams: teams.map(it =>
        it.team_id === team.team_id ? { ...it, isDelete: true } : it
      ),
    }));

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
      configurableTeam: {
        ...(configurableTeam as ITeam),
        [name]: value,
        isChange: true,
      },
    }));

  onSaveTeam = () => {
    const { configurableTeam } = this.state;

    if (configurableTeam) {
      this.setState(({ teams }) => ({
        teams: teams.map(it =>
          it.team_id === configurableTeam.team_id ? configurableTeam : it
        ),
      }));
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

  onConfirmModalClose = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  onCancel = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  render() {
    const { isLoading, divisions, pools, loadPools } = this.props;

    const {
      teams,
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
            onSaveClick={this.onSaveClick}
            onCancelClick={this.onCancel}
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
              teams={teams.filter(it => !it.isDelete)}
              isEdit={isEdit}
              changePool={this.changePool}
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
        <PopupExposure
          isOpen={this.state.isConfirmModalOpen}
          onClose={this.onConfirmModalClose}
          onExitClick={this.onCancelClick}
          onSaveClick={this.onSaveClick}
        />
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
    isLoaded: state.teams.isLoaded,
    divisions: state.teams.divisions,
    pools: state.teams.pools,
    teams: state.teams.teams,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadDivisionsTeams, loadPools, saveTeams }, dispatch)
)(Teams);
