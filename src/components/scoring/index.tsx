import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import ScoringItem from './components/scoring-Item';
import { RouteComponentProps } from 'react-router-dom';
import styles from './styles.module.scss';
// import Api from 'api/api';

import Modal from '../common/modal';

interface MatchParams {
  eventId?: string;
}

interface Props {}

interface State {
  isModalOpen: boolean;
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
      isModalOpen: false,
    };
  }

  onToggleModal = () =>
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));

  render() {
    const { isModalOpen } = this.state;

    return (
      <section>
        <button onClick={this.onToggleModal}>open modal</button>
        <p className={styles.navWrapper}>
          <Button label="Record Scores" variant="contained" color="primary" />
        </p>
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          <ul className={styles.scoringList}>
            <ScoringItem />
          </ul>
        </div>

        <Modal isOpen={isModalOpen} onClose={this.onToggleModal}>
          <p>1</p>
        </Modal>
      </section>
    );
  }
}

export default Sсoring;
