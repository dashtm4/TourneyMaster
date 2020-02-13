import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { loadTeams } from './logic/actions';
import ScoringItem from './components/scoring-Item';
import TeamDetailsPopup from './components/team-details-popup';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import Modal from '../common/modal';
import { AppState } from './logic/reducer';
import { ITeam } from '../../common/models/teams';
import { BindingAction } from '../../common/models/callback';
import styles from './styles.module.scss';
// import Api from 'api/api';

interface MatchParams {
  eventId?: string;
}

interface Props {
  teams: ITeam[];
  loadTeams: BindingAction;
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
    // const eventId = this.props.match.params.eventId;

    // const game = await Api.get(`/divisions?division_id=${eventId}`);

    // console.log(game);

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

  onCloseModal = () =>
    this.setState({ changeableTeam: null, isModalOpen: false, isEdit: false });

  onOpenTeamDetails = (team: ITeam) => {
    this.setState({ isModalOpen: true, changeableTeam: team });
  };

  onEditTeam = () => {
    this.setState({ isModalOpen: true, isEdit: true });
  };

  onChangeTeam = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = evt;

    this.setState(({ changeableTeam }) => ({
      changeableTeam: { ...(changeableTeam as ITeam), [name]: value },
    }));
  };

  render() {
    const { isModalOpen, isEdit, changeableTeam } = this.state;
    const { teams } = this.props;

    return (
      <section>
        <p className={styles.navWrapper}>
          <Button label="Record Scores" variant="contained" color="primary" />
        </p>
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          <ul className={styles.scoringList}>
            <ScoringItem
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
    teams: state.scoring.teams,
  }),
  (dispatch: Dispatch) => bindActionCreators({ loadTeams }, dispatch)
)(Sсoring);
