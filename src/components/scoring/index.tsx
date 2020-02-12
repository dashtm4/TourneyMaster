import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import ScoringItem from './components/scoring-Item';
import { RouteComponentProps } from 'react-router-dom';
import styles from './styles.module.scss';
import Api from 'api/api';

interface MatchParams {
  eventId?: string;
}

interface Props {}

class Sсoring extends React.Component<
  Props & RouteComponentProps<MatchParams>
> {
  // async componentDidMount() {
  //   const eventId = this.props.match.params.eventId;

  //   const game = await Api.get(`/divisions?division_id=${eventId}`);

  //   console.log(game);
  // }

  render() {
    return (
      <section>
        <p className={styles.navWrapper}>
          <Button label="Record Scores" variant="contained" color="primary" />
        </p>
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          <ul className={styles.scoringList}>
            <ScoringItem />
          </ul>
        </div>
      </section>
    );
  }
}

export default Sсoring;
