import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { loadDivision, loadTeams, editTeam, deleteTeam } from './logic/actions';
import ScoringItem from './components/scoring-Item';
import TeamDetailsPopup from './components/team-details-popup';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import Modal from '../common/modal';
import { AppState } from './logic/reducer';
import {
  IDisision,
  ITeam,
  BindingAction,
  BindingCbWithOne,
} from '../../common/models';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  division: IDisision | null;
  teams: ITeam[];
  loadDivision: (eventId: string) => void;
  loadTeams: BindingAction;
  editTeam: BindingCbWithOne<ITeam>;
  deleteTeam: (teamId: string) => void;
}

interface State {
  changeableTeam: ITeam | null;
  isModalOpen: boolean;
  isEdit: boolean;
}

class Sсoring extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  async componentDidMount() {
    const { loadDivision } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadDivision(eventId);
    }

    const { loadTeams } = this.props;

    loadTeams();
  }

  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isModalOpen: false,
      isEdit: false,
      changeableTeam: null,
    };
  }

  onEditTeam = () => {
    this.setState({ isModalOpen: true, isEdit: true });
  };

  onSaveTeam = () => {
    const { changeableTeam } = this.state;
    const { editTeam } = this.props;

    if (changeableTeam) {
      editTeam(changeableTeam);
    }

    this.onCloseModal();
  };

  onDeleteTeam = (teamId: string) => {
    const { deleteTeam } = this.props;

    deleteTeam(teamId);

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

  onOpenTeamDetails = (team: ITeam) => {
    this.setState({ isModalOpen: true, changeableTeam: team });
  };

  onCloseModal = () =>
    this.setState({ changeableTeam: null, isModalOpen: false, isEdit: false });

  render() {
    const { isModalOpen, isEdit, changeableTeam } = this.state;
    const { teams, division } = this.props;

    return (
      <section>
        <p className={styles.navWrapper}>
          <Button label="Record Scores" variant="contained" color="primary" />
        </p>
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          <ul className={styles.scoringList}>
            <ScoringItem
              division={division}
              teams={teams}
              onOpenTeamDetails={this.onOpenTeamDetails}
            />
          </ul>
        </div>
        <Modal isOpen={isModalOpen} onClose={this.onCloseModal}>
          <TeamDetailsPopup
            team={changeableTeam}
            isEdit={isEdit}
            onEditTeamClick={this.onEditTeam}
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
    division: state.scoring.division,
    teams: state.scoring.teams,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadDivision, loadTeams, deleteTeam, editTeam },
      dispatch
    )
)(Sсoring);
