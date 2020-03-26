import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { bindActionCreators, Dispatch } from 'redux';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { ITeam, ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import Scheduler from './Scheduler';
import { ISchedulesState } from './logic/reducer';
import { IFetchedDivision } from 'common/models/schedule/divisions';
import {
  fetchFields,
  fetchEventSummary,
  saveDraft,
  updateDraft,
  fetchSchedulesDetails,
} from './logic/actions';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { ITournamentData } from 'common/models/tournament';
import { TableSchedule, Button, Paper, PopupExposure } from 'components/common';
import {
  defineGames,
  sortFieldsByPremier,
  settleTeamsPerGames,
  IGame,
} from 'components/common/matrix-table/helper';
import {
  mapFieldsData,
  mapTeamsData,
  mapFacilitiesData,
  mapDivisionsData,
} from './mapTournamentData';
import {
  calculateTimeSlots,
  setGameOptions,
  getTimeValuesFromEventSchedule,
} from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import Diagnostics, { IDiagnosticsInput } from './diagnostics';
import formatTeamsDiagnostics from './diagnostics/teamsDiagnostics';
import formatDivisionsDiagnostics from './diagnostics/divisionsDiagnostics';
import { DiagnosticTypes } from './types';
import styles from './styles.module.scss';
import {
  fillSchedulesTable,
  onScheduleUndo,
} from './logic/schedules-table/actions';
import { ISchedulesTableState } from './logic/schedules-table/schedulesTableReducer';
import {
  mapSchedulesTeamCards,
  mapScheduleData,
  mapTeamsFromSchedulesDetails,
} from './mapScheduleData';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { IConfigurableSchedule, ISchedule } from 'common/models';
import { errorToast } from 'components/common/toastr/showToasts';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { Loader } from 'components/common';

type PartialTournamentData = Partial<ITournamentData>;
type PartialSchedules = Partial<ISchedulesState>;
interface IMapStateToProps extends PartialTournamentData, PartialSchedules {
  schedulesTeamCards?: ITeamCard[];
  draftSaved?: boolean;
  savingInProgress?: boolean;
  scheduleData?: IConfigurableSchedule | null;
  schedulesHistoryLength?: number;
  schedule?: ISchedule;
  schedulesDetails?: ISchedulesDetails[];
}

interface IMapDispatchToProps {
  saveDraft: (
    scheduleData: ISchedule,
    scheduleDetails: ISchedulesDetails[]
  ) => void;
  updateDraft: (
    scheduleData: ISchedule,
    scheduleDetails: ISchedulesDetails[]
  ) => void;
  fetchFields: (facilitiesIds: string[]) => void;
  fetchEventSummary: (eventId: string) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  onScheduleUndo: () => void;
  fetchSchedulesDetails: (scheduleId: string) => void;
}

interface ComponentProps {
  match: any;
  history: History;
}

interface IRootState {
  pageEvent?: IPageEventState;
  schedules?: ISchedulesState;
  schedulesTable?: ISchedulesTableState;
  scheduling?: ISchedulingState;
}

type Props = IMapStateToProps & IMapDispatchToProps & ComponentProps;

interface State {
  games?: IGame[];
  scheduleId?: string;
  timeSlots?: ITimeSlot[];
  teams?: ITeam[];
  fields?: IField[];
  facilities?: IScheduleFacility[];
  schedulerResult?: Scheduler;
  divisions?: IFetchedDivision[];
  teamsDiagnostics?: IDiagnosticsInput;
  divisionsDiagnostics?: IDiagnosticsInput;
  teamsDiagnosticsOpen: boolean;
  divisionsDiagnosticsOpen: boolean;
  cancelConfirmationOpen: boolean;
  isLoading: boolean;
}

class Schedules extends Component<Props, State> {
  timer: any;
  state: State = {
    teamsDiagnosticsOpen: false,
    divisionsDiagnosticsOpen: false,
    cancelConfirmationOpen: false,
    isLoading: false,
  };

  async componentDidMount() {
    this.timer = setTimeout(() => this.setState({ isLoading: false }), 5000);
    const { facilities, match } = this.props;
    const { eventId, scheduleId } = match?.params;
    const facilitiesIds = facilities?.map(f => f.facilities_id);

    if (facilitiesIds?.length) {
      this.props.fetchFields(facilitiesIds);
    }

    this.props.fetchEventSummary(eventId);

    if (scheduleId) {
      this.setState({ scheduleId });
      this.props.fetchSchedulesDetails(scheduleId);
    } else {
      await this.calculateNeccessaryData();
      this.calculateSchedules();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { schedule, schedulesDetails } = this.props;
    const { scheduleId, teams } = this.state;

    if (!prevProps.schedule && this.props.schedule) {
      this.calculateNeccessaryData();
      return;
    }

    if (
      !prevProps.schedulesTeamCards &&
      schedulesDetails?.length &&
      teams?.length &&
      scheduleId &&
      schedule
    ) {
      const mappedTeams = mapTeamsFromSchedulesDetails(schedulesDetails, teams);
      this.props.fillSchedulesTable(mappedTeams);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  calculateNeccessaryData = () => {
    const {
      scheduleData,
      event,
      schedule,
      fields,
      teams,
      divisions,
      facilities,
    } = this.props;

    const localSchedule = scheduleData || schedule;

    if (
      !localSchedule ||
      !event ||
      !fields ||
      !teams ||
      !divisions ||
      !facilities
    )
      return console.log('calculateNeccessaryData: fail');

    const timeValues = getTimeValuesFromEventSchedule(event, localSchedule);
    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);

    const mappedTeams = mapTeamsData(teams, divisions);
    const mappedFacilities = mapFacilitiesData(facilities);

    return this.setState({
      games,
      timeSlots,
      fields: sortedFields,
      teams: mappedTeams,
      facilities: mappedFacilities,
    });
  };

  calculateSchedules = () => {
    const { fields, teams, games, timeSlots, facilities } = this.state;
    const { divisions, event } = this.props;

    if (!event || !fields || !teams || !games || !timeSlots || !facilities)
      return;

    const mappedDivisions = mapDivisionsData(divisions!);
    const gameOptions = setGameOptions(event);

    const tournamentBaseInfo = {
      facilities,
      gameOptions,
      divisions: mappedDivisions,
    };

    const schedulerResult = new Scheduler(
      fields,
      teams,
      games,
      timeSlots,
      tournamentBaseInfo
    );

    this.setState(
      {
        schedulerResult,
      },
      this.calculateDiagnostics
    );

    this.props.fillSchedulesTable(schedulerResult.teamCards);
  };

  calculateDiagnostics = () => {
    const { schedulerResult } = this.state;
    if (!schedulerResult) return;

    const teamsDiagnostics = formatTeamsDiagnostics(schedulerResult);
    const divisionsDiagnostics = formatDivisionsDiagnostics(schedulerResult);

    this.setState({
      teamsDiagnostics,
      divisionsDiagnostics,
    });
  };

  openTeamsDiagnostics = () =>
    this.setState({
      teamsDiagnosticsOpen: true,
    });

  openDivisionsDiagnostics = () =>
    this.setState({
      divisionsDiagnosticsOpen: true,
    });

  closeDiagnostics = () =>
    this.setState({
      teamsDiagnosticsOpen: false,
      divisionsDiagnosticsOpen: false,
    });

  openCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: true });

  closeCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: false });

  onCancel = () => {
    this.openCancelConfirmation();
  };

  onExit = () => {
    this.props.history.goBack();
  };

  onSaveDraft = async () => {
    const { cancelConfirmationOpen, games, scheduleId } = this.state;
    const {
      schedulesTeamCards,
      scheduleData,
      draftSaved,
      schedulesDetails,
    } = this.props;

    const schedule = scheduleData
      ? mapScheduleData(scheduleData)
      : this.props.schedule;

    if (!games || !schedulesTeamCards || !schedule)
      return errorToast("Couldn't save the data");

    const schedulesTableGames = settleTeamsPerGames(games, schedulesTeamCards);
    const scheduleDetails: ISchedulesDetails[] = await mapSchedulesTeamCards(
      schedule,
      schedulesTableGames,
      true,
      schedulesDetails
    );

    if (!scheduleId && !draftSaved) {
      this.props.saveDraft(schedule, scheduleDetails);
    } else {
      this.props.updateDraft(schedule, scheduleDetails);
    }

    if (cancelConfirmationOpen) {
      this.closeCancelConfirmation();
      this.onExit();
    }
  };

  onScheduleCardsUpdate = (teamCards: ITeamCard[]) => {
    this.props.fillSchedulesTable(teamCards);
  };

  render() {
    const {
      divisions,
      event,
      eventSummary,
      schedulesTeamCards,
      draftSaved,
      onScheduleUndo,
      schedulesHistoryLength,
      savingInProgress,
      scheduleData,
    } = this.props;

    const {
      fields,
      timeSlots,
      games,
      facilities,
      teamsDiagnostics,
      divisionsDiagnostics,
      teamsDiagnosticsOpen,
      divisionsDiagnosticsOpen,
      cancelConfirmationOpen,
    } = this.state;

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      divisions?.length &&
      facilities?.length &&
      event &&
      eventSummary?.length &&
      schedulesTeamCards?.length
    );

    return (
      <div className={styles.container}>
        <div className={styles.paperWrapper}>
          <Paper>
            <div className={styles.paperContainer}>
              <Button
                label="Cancel"
                variant="text"
                color="secondary"
                onClick={this.onCancel}
              />
              <Button
                label="Save Draft"
                variant="contained"
                color="primary"
                disabled={draftSaved || savingInProgress}
                onClick={this.onSaveDraft}
              />
            </div>
          </Paper>
        </div>

        {loadCondition && !this.state.isLoading ? (
          <TableSchedule
            event={event!}
            fields={fields!}
            games={games!}
            timeSlots={timeSlots!}
            divisions={divisions!}
            facilities={facilities!}
            teamCards={schedulesTeamCards!}
            eventSummary={eventSummary!}
            scheduleData={scheduleData!}
            historyLength={schedulesHistoryLength}
            onTeamCardsUpdate={this.onScheduleCardsUpdate}
            onUndo={onScheduleUndo}
          />
        ) : (
          <div className={styles.loadingWrapper}>
            <Loader />
            <div>Calculating...</div>
          </div>
        )}

        <div className={styles.diagnosticsContainer}>
          {loadCondition && !this.state.isLoading && teamsDiagnostics && (
            <>
              <Button
                label="Teams Diagnostics"
                variant="contained"
                color="primary"
                onClick={this.openTeamsDiagnostics}
              />
              <Diagnostics
                isOpen={teamsDiagnosticsOpen}
                tableData={teamsDiagnostics}
                onClose={this.closeDiagnostics}
                diagnosticType={DiagnosticTypes.TEAMS_DIAGNOSTICS}
              />
            </>
          )}

          {loadCondition && !this.state.isLoading && divisionsDiagnostics && (
            <>
              <Button
                label="Divisions Diagnostics"
                variant="contained"
                color="primary"
                onClick={this.openDivisionsDiagnostics}
              />
              <Diagnostics
                isOpen={divisionsDiagnosticsOpen}
                tableData={divisionsDiagnostics}
                onClose={this.closeDiagnostics}
                diagnosticType={DiagnosticTypes.DIVISIONS_DIAGNOSTICS}
              />
            </>
          )}

          {/* CONFIRMATION */}
          <PopupExposure
            isOpen={cancelConfirmationOpen}
            onClose={this.closeCancelConfirmation}
            onExitClick={this.onExit}
            onSaveClick={this.onSaveDraft}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  schedules,
  scheduling,
  schedulesTable,
}: IRootState) => ({
  event: pageEvent?.tournamentData.event,
  facilities: pageEvent?.tournamentData.facilities,
  divisions: pageEvent?.tournamentData.divisions,
  teams: pageEvent?.tournamentData.teams,
  fields: pageEvent?.tournamentData.fields,
  eventSummary: schedules?.eventSummary,
  schedulesTeamCards: schedulesTable?.current,
  schedulesHistoryLength: schedulesTable?.previous.length,
  draftSaved: schedules?.draftIsAlreadySaved,
  savingInProgress: schedules?.savingInProgress,
  scheduleData: scheduling?.schedule,
  schedule: schedules?.schedule,
  schedulesDetails: schedules?.schedulesDetails,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      saveDraft,
      updateDraft,
      fetchFields,
      fetchEventSummary,
      fillSchedulesTable,
      onScheduleUndo,
      fetchSchedulesDetails,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Schedules);
