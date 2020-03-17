import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import History from 'browserhistory';
import { loadScoresData } from './logic/actions';
import { AppState } from './logic/reducer';
import Navigation from './components/navigation';
import { Loader, PopupExposure /*, TableSchedule */ } from 'components/common';
import { IDivision, ITeam, IEventSummary } from 'common/models';
import { Routes } from 'common/enums';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  teams: ITeam[];
  eventSummary: IEventSummary[];
  loadScoresData: (eventId: string) => void;
}

interface State {
  isExposurePopupOpen: boolean;
  isEnterScores: boolean;
}

class RecordScores extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isExposurePopupOpen: false,
      isEnterScores: false,
    };
  }

  componentDidMount() {
    const { loadScoresData } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadScoresData(eventId);
    }
  }

  onChangeView = (flag: boolean) => this.setState({ isEnterScores: flag });

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
    const { isEnterScores, isExposurePopupOpen } = this.state;

    const { isLoading /*, divisions, teams, eventSummary */ } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <>
        <Navigation
          isEnterScores={isEnterScores}
          onLeavePage={this.onLeavePage}
          onChangeView={this.onChangeView}
        />
        <section className={styles.scoringWrapper}>
          <h2 className="visually-hidden">Scoring</h2>
          {/* <TableSchedule
            divisions={divisions}
            teams={teams}
            eventSummary={eventSummary}
            isEnterScores={isEnterScores}
          /> */}
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
    teams: recordScores.teams,
    eventSummary: recordScores.eventSummary,
  }),
  (dispatch: Dispatch) => bindActionCreators({ loadScoresData }, dispatch)
)(RecordScores);
