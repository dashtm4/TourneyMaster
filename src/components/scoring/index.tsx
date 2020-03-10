import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import {
  loadDivision,
  loadPools,
  loadTeams,
  editTeam,
  deleteTeam,
} from './logic/actions';
import { AppState } from './logic/reducer';
import Navigation from './components/navigation';
import ScoringItem from './components/scoring-Item';
import {
  HeadingLevelTwo,
  Modal,
  Loader,
  PopupTeamEdit,
} from 'components/common';
import { IDivision, IPool, ITeam, BindingCbWithOne } from 'common/models';
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
  loadDivision: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
  editTeam: BindingCbWithOne<ITeam>;
  deleteTeam: (teamId: string) => void;
}

interface State {
  changeableTeam: ITeam | null;
  currentDivision: string | null;
  currentPool: string | null;
  isModalOpen: boolean;
}

class Sсoring extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      currentDivision: null,
      currentPool: null,
      changeableTeam: null,
      isModalOpen: false,
    };
  }

  componentDidMount() {
    const { loadDivision } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadDivision(eventId);
    }
  }

  onSaveTeam = () => {
    const { changeableTeam } = this.state;
    const { editTeam } = this.props;

    if (changeableTeam) {
      editTeam(changeableTeam);
    }

    this.onCloseModal();
  };

  onDeleteTeam = (team: ITeam) => {
    const { deleteTeam } = this.props;

    deleteTeam(team.team_id);

    this.onCloseModal();
  };

  onChangeTeam = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = evt;

    this.setState(({ changeableTeam }) => ({
      changeableTeam: { ...(changeableTeam as ITeam), [name]: value },
    }));
  };

  onOpenTeamDetails = (team: ITeam, divisionName: string, poolName: string) => {
    this.setState({
      isModalOpen: true,
      changeableTeam: team,
      currentDivision: divisionName,
      currentPool: poolName,
    });
  };

  onCloseModal = () =>
    this.setState({
      isModalOpen: false,
      changeableTeam: null,
      currentDivision: null,
      currentPool: null,
    });

  render() {
    const {
      isModalOpen,
      changeableTeam,
      currentDivision,
      currentPool,
    } = this.state;

    const {
      isLoading,
      pools,
      teams,
      divisions,
      loadPools,
      loadTeams,
    } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <section>
        <Navigation eventId={this.props.match.params.eventId} />
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          <ul className={styles.scoringList}>
            {divisions.map(division => (
              <ScoringItem
                division={division}
                pools={pools.filter(
                  pool => pool.division_id === division.division_id
                )}
                teams={teams}
                loadPools={loadPools}
                loadTeams={loadTeams}
                onOpenTeamDetails={this.onOpenTeamDetails}
                key={division.division_id}
              />
            ))}
          </ul>
        </div>
        <Modal isOpen={isModalOpen} onClose={this.onCloseModal}>
          <PopupTeamEdit
            team={changeableTeam}
            division={currentDivision}
            pool={currentPool}
            onSaveTeamClick={this.onSaveTeam}
            onDeleteTeamClick={this.onDeleteTeam}
            onChangeTeam={this.onChangeTeam}
            onCloseModal={this.onCloseModal}
          />
        </Modal>
      </section>
    );
  }
}

interface IRootState {
  scoring: AppState;
}

export default connect(
  (state: IRootState) => ({
    isLoading: state.scoring.isLoading,
    isLoaded: state.scoring.isLoaded,
    divisions: state.scoring.divisions,
    pools: state.scoring.pools,
    teams: state.scoring.teams,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadDivision, loadPools, loadTeams, deleteTeam, editTeam },
      dispatch
    )
)(Sсoring);
