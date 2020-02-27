import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Navigation from './components/navigation';
import Scoring from './components/scoring';

enum DayTypes {
  DAY_ONE = 'Day 1',
  DAY_TWO = 'Day 2',
  DAY_THREE = 'Day 3',
}

enum ViewTypes {
  VIEW_ONLY = 'viewOnly',
  ENTER_SCORES = 'enterScores',
}

interface MatchParams {
  eventId?: string;
}

interface Props {}

interface State {
  view: ViewTypes;
  selectedDay: DayTypes;
  selectedDivision: string;
  selectedTeam: string;
  selectedField: string;
}

class RecordScores extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      view: ViewTypes.VIEW_ONLY,
      selectedDay: DayTypes.DAY_ONE,
      selectedDivision: 'all',
      selectedTeam: 'all',
      selectedField: 'all',
    };
  }

  onChangeSelect = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ [name]: value } as Pick<State, keyof State>);

  onChangeView = (type: ViewTypes) => this.setState({ view: type });

  onChangeDay = (day: DayTypes) => this.setState({ selectedDay: day });

  render() {
    const { view, selectedDivision, selectedTeam, selectedField } = this.state;

    return (
      <>
        <Navigation
          view={view}
          eventId={this.props.match.params.eventId}
          onChangeView={this.onChangeView}
        />
        <Scoring
          selectedDivision={selectedDivision}
          selectedTeam={selectedTeam}
          selectedField={selectedField}
          onChangeSelect={this.onChangeSelect}
          onChangeDay={this.onChangeDay}
        />
      </>
    );
  }
}

export { ViewTypes, DayTypes };

export default RecordScores;
