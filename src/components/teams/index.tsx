import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { loadTeamsData, loadPools, saveTeams } from './logic/actions';
import Navigation from './components/navigation';
import TeamManagement from './components/team-management';
import {
  HeadingLevelTwo,
  Modal,
  PopupTeamEdit,
  Loader,
  PopupExposure,
} from 'components/common';
import { IAppState } from 'reducers/root-reducer.types';
import {
  IDivision,
  IPool,
  ITeam,
  ISchedulesGameWithNames,
} from '../../common/models';
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
  games: ISchedulesGameWithNames[];
  loadTeamsData: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  saveTeams: (teams: ITeam[]) => void;
}

interface State {
  teams: ITeam[];
  configurableTeam: ITeam | null;
  currentDivision: string | null;
  currentPool: string | null;
  isEditPopupOpen: boolean;
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
      isEditPopupOpen: false,
      isConfirmModalOpen: false,
    };
  }

  componentDidMount() {
    const { loadTeamsData } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadTeamsData(eventId);
    }
  }

  componentDidUpdate(PrevProps: Props) {
    const { isLoading, teams } = this.props;

    if (PrevProps.isLoading !== isLoading) {
      this.setState({ teams: teams });
    }
  }

  onSaveClick = () => {
    const eventId = this.props.match.params.eventId;
    const { saveTeams } = this.props;
    const { teams } = this.state;

    if (eventId) {
      saveTeams(teams);
    }
    this.setState({ isConfirmModalOpen: false });
  };

  onCancelClick = () => {
    const { teams } = this.props;

    this.setState({ teams, isConfirmModalOpen: false });
  };

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
      isEditPopupOpen: false,
      configurableTeam: null,
      currentDivision: null,
    });

  onConfirmModalClose = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  onCancel = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  render() {
    const { divisions, pools, games, isLoading, loadPools } = this.props;

    const {
      teams,
      configurableTeam,
      currentDivision,
      currentPool,
      isEditPopupOpen,
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <>
        <section>
          <Navigation
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
              loadPools={loadPools}
              onEditPopupOpen={this.onEditPopupOpen}
            />
          </ul>
        </section>
        <Modal isOpen={isEditPopupOpen} onClose={this.onCloseModal}>
          <PopupTeamEdit
            team={configurableTeam}
            division={currentDivision}
            pool={currentPool}
            onChangeTeam={this.onChangeTeam}
            onSaveTeamClick={this.onSaveTeam}
            onDeleteTeamClick={this.onDeleteTeam}
            onCloseModal={this.onCloseModal}
            games={games}
          />
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

export default connect(
  ({ teams }: IAppState) => ({
    isLoading: teams.isLoading,
    isLoaded: teams.isLoaded,
    divisions: teams.divisions,
    pools: teams.pools,
    teams: teams.teams,
    games: teams.games,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadTeamsData, loadPools, saveTeams }, dispatch)
)(Teams);
