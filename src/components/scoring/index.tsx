import React from 'react';
import TeamDetailsPopup from './components/team-details-popup';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import Modal from '../common/modal';
import ScoringItem from './components/scoring-Item';
import { RouteComponentProps } from 'react-router-dom';
import styles from './styles.module.scss';
import { ITeam } from '../../common/models/teams';
// import Api from 'api/api';

import { teams } from './mocks/teams';

interface MatchParams {
  eventId?: string;
}

interface Props {}

interface State {
  changeableTeam: ITeam | null;
  isModalOpen: boolean;
  isEdit: boolean;
}

class Sсoring extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  // async componentDidMount() {
  //   const eventId = this.props.match.params.eventId;

  //   const game = await Api.get(`/divisions?division_id=${eventId}`);

  //   console.log(game);
  // }

  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isModalOpen: true,
      isEdit: false,
      changeableTeam: teams[0],
    };
  }

  onCloseModal = () =>
    this.setState({ changeableTeam: null, isModalOpen: false, isEdit: false });

  onEditTeam = () => {
    this.setState({ isEdit: true });
  };

  onOpenTeamDetails = (team: ITeam) => {
    this.setState({ isModalOpen: true, changeableTeam: team });
  };

  render() {
    const { isModalOpen, changeableTeam } = this.state;

    return (
      <section>
        <p className={styles.navWrapper}>
          <Button label="Record Scores" variant="contained" color="primary" />
        </p>
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          <ul className={styles.scoringList}>
            <ScoringItem onOpenTeamDetails={this.onOpenTeamDetails} />
          </ul>
        </div>
        <Modal isOpen={isModalOpen} onClose={this.onCloseModal}>
          <TeamDetailsPopup team={changeableTeam} />
        </Modal>
      </section>
    );
  }
}

export default Sсoring;
