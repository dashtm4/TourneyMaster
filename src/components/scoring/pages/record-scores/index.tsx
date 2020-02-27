import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Navigation from './components/navigation';
import Scoring from './components/scoring';

interface Props {}

interface State {
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
}

interface MatchParams {
  eventId?: string;
}

class RecordScores extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      selectedDivision: 'all',
      selectedTeam: 'all',
      selectedField: 'all',
    };
  }

  render() {
    const { selectedDivision, selectedTeam, selectedField } = this.state;

    return (
      <>
        <Navigation eventId={this.props.match.params.eventId} />
        <Scoring
          selectedDivision={selectedDivision}
          selectedTeam={selectedTeam}
          selectedField={selectedField}
        />
      </>
    );
  }
}

export default RecordScores;
