import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Navigation from './components/navigation';

interface Props {}

interface MatchParams {
  eventId?: string;
}

class RecordScores extends React.Component<
  Props & RouteComponentProps<MatchParams>
> {
  render() {
    return (
      <>
        <Navigation eventId={this.props.match.params.eventId} />
      </>
    );
  }
}

export default RecordScores;
