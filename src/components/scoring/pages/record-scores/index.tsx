import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import History from 'browserhistory';
import { loadScoresData } from './logic/actions';
import { AppState } from './logic/reducer';
import Navigation from './components/navigation';
import ScoringFilter from './components/scoring-filter';
import ScoringTable from './components/scoring-table';
import { Loader, PopupExposure } from 'components/common';
import { IDivision, ITeam, IEventSummary, IField } from 'common/models';
import { Routes } from 'common/enums';
import { DefaulSelectFalues, ViewTypes, DayTypes } from './types';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  fields: IField[];
  teams: ITeam[];
  eventSummary: IEventSummary[];
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

    History.push(`${Routes.SCORING}/${eventId || ''}`);
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

    const { isLoaded, divisions, fields, teams, eventSummary } = this.props;

    if (!isLoaded) {
      return <Loader />;
    }

    return (
      <>
        <Navigation
          view={view}
          onLeavePage={this.onLeavePage}
          onChangeView={this.onChangeView}
        />
        <section className={styles.scoringWrapper}>
          <h2 className="visually-hidden">Scoring</h2>
          <ScoringFilter
            divisions={divisions}
            teams={teams}
            eventSummary={eventSummary}
            selectedDay={selectedDay}
            selectedDivision={selectedDivision}
            selectedTeam={selectedTeam}
            selectedField={selectedField}
            onChangeSelect={this.onChangeSelect}
            onChangeDay={this.onChangeDay}
          />
          <ScoringTable
            divisions={divisions}
            teams={teams}
            fields={fields}
            isEnterScores={view === ViewTypes.ENTER_SCORES}
          />
        </section>
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

export default connect(
  ({ recordScores }: IRootState) => ({
    isLoading: recordScores.isLoading,
    isLoaded: recordScores.isLoaded,
    divisions: recordScores.divisions,
    fields: recordScores.fields,
    teams: recordScores.teams,
    eventSummary: recordScores.eventSummary,
  }),
  (dispatch: Dispatch) => bindActionCreators({ loadScoresData }, dispatch)
)(RecordScores);
