import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import History from 'browserhistory';
import { loadScoresData } from './logic/actions';
import { AppState } from './logic/reducer';
import Navigation from './components/navigation';
import Scoring from './components/scoring';
import { Loader, PopupExposure } from 'components/common';
import { IDivision, ITeam, IField } from 'common/models';
import { Routes } from 'common/constants';
import { DefaulSelectFalues } from './types';

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

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  teams: ITeam[];
  fields: IField[];
  loadScoresData: (eventId: string) => void;
}

interface State {
  isExposurePopupOpen: boolean;
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
      selectedDivision: DefaulSelectFalues.ALL,
      selectedTeam: DefaulSelectFalues.ALL,
      selectedField: DefaulSelectFalues.ALL,
      isExposurePopupOpen: false,
    };
  }

  componentDidMount() {
    const { loadScoresData } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadScoresData(eventId);
    }
  }

  onChangeSelect = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ [name]: value } as Pick<any, keyof State>);

  onChangeView = (type: ViewTypes) => this.setState({ view: type });

  onChangeDay = (day: DayTypes) => this.setState({ selectedDay: day });

  leavePage = () => {
    const eventId = this.props.match.params.eventId;

    History.push(`${Routes.SCORING}${eventId || ''}`);
  };

  onLeavePage = () => {
    const { teams } = this.props;
    const isTeamChange = teams.some(it => it.isChange);

    // ! change in future
    !isTeamChange
      ? this.setState({ isExposurePopupOpen: true })
      : this.leavePage();
  };

  onClosePopup = () => this.setState({ isExposurePopupOpen: false });

  render() {
    const {
      view,
      selectedDay,
      selectedDivision,
      selectedTeam,
      selectedField,
      isExposurePopupOpen,
    } = this.state;

    const { isLoading, divisions, teams, fields } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <>
        <Navigation
          view={view}
          onLeavePage={this.onLeavePage}
          onChangeView={this.onChangeView}
        />
        <Scoring
          divisions={divisions}
          teams={teams}
          fields={fields}
          selectedDay={selectedDay}
          selectedDivision={selectedDivision}
          selectedTeam={selectedTeam}
          selectedField={selectedField}
          onChangeSelect={this.onChangeSelect}
          onChangeDay={this.onChangeDay}
        />
        <PopupExposure
          isOpen={isExposurePopupOpen}
          onClose={this.onClosePopup}
          onExitClick={this.leavePage}
          onSaveClick={() => {}}
        />
      </>
    );
  }
}

interface IRootState {
  recordScores: AppState;
}

export { ViewTypes, DayTypes };

export default connect(
  ({ recordScores }: IRootState) => ({
    isLoading: recordScores.isLoading,
    isLoaded: recordScores.isLoaded,
    divisions: recordScores.divisions,
    teams: recordScores.teams,
    fields: recordScores.fields,
  }),
  (dispatch: Dispatch) => bindActionCreators({ loadScoresData }, dispatch)
)(RecordScores);