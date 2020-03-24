import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { bindActionCreators, Dispatch } from 'redux';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { ITeam, ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import Scheduler from './Scheduler';
import { ISchedulesState } from './logic/reducer';
import {
  IFetchedDivision,
  IScheduleDivision,
} from 'common/models/schedule/divisions';
import { fetchFields, fetchEventSummary, saveDraft } from './logic/actions';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { ITournamentData } from 'common/models/tournament';
import { TableSchedule, Button, Paper, PopupExposure } from 'components/common';
import {
  defineGames,
  IDefinedGames,
  sortFieldsByPremier,
  settleTeamsPerGames,
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
  getTimeValuesFromSchedule,
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
import { mapSchedulesTeamCards, mapScheduleData } from './mapScheduleData';
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
  scheduleData?: IConfigurableSchedule | null;
  schedulesHistoryLength?: number;
}

interface IMapDispatchToProps {
  saveDraft: (scheduleData: ISchedule, scheduleDetails: any[]) => void;
  fetchFields: (facilitiesIds: string[]) => void;
  fetchEventSummary: (eventId: string) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  onScheduleUndo: () => void;
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
    isLoading: true,
  };

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ isLoading: false }), 5000);
    const { facilities, match } = this.props;
    const { eventId } = match?.params;
    const facilitiesIds = facilities?.map(f => f.facilities_id);

    if (facilitiesIds?.length) {
      this.props.fetchFields(facilitiesIds);
    }

    this.props.fetchEventSummary(eventId);
    this.calculateSchedules();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  calculateSchedules = () => {
    const {
      fields,
      event,
      teams,
      divisions,
      facilities,
      scheduleData,
    } = this.props;

    if (
      !fields?.length ||
      !teams?.length ||
      !facilities?.length ||
      !divisions?.length ||
      !scheduleData ||
      !event
    )
      return;

    const timeValues = getTimeValuesFromSchedule(scheduleData);
    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const definedGames: IDefinedGames = defineGames(sortedFields, timeSlots!);
    const { games } = definedGames;

    const mappedTeams: ITeam[] = mapTeamsData(teams, divisions);

    const gameOptions = setGameOptions(event);

    const mappedFacilities: IScheduleFacility[] = mapFacilitiesData(facilities);
    const mappedDivisions: IScheduleDivision[] = mapDivisionsData(divisions);

    const tournamentBaseInfo = {
      facilities: mappedFacilities,
      divisions: mappedDivisions,
      gameOptions,
    };

    const schedulerResult: Scheduler = new Scheduler(
      sortedFields,
      mappedTeams,
      games,
      timeSlots!,
      tournamentBaseInfo
    );

    this.setState(
      {
        schedulerResult,
        fields: sortedFields,
        facilities: mappedFacilities,
        timeSlots,
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
    const { cancelConfirmationOpen, schedulerResult } = this.state;
    const { games } = schedulerResult || {};
    const { schedulesTeamCards, scheduleData } = this.props;

    if (!games || !schedulesTeamCards || !scheduleData)
      return errorToast("Couldn't save the data");

    const schedulesTableGames = settleTeamsPerGames(games, schedulesTeamCards);

    const schedule = mapScheduleData(scheduleData);
    const scheduleDetails: ISchedulesDetails[] = await mapSchedulesTeamCards(
      schedule,
      schedulesTableGames,
      true
    );

    this.props.saveDraft(schedule, scheduleDetails);

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
    } = this.props;
    const {
      fields,
      timeSlots,
      schedulerResult,
      facilities,
      teamsDiagnostics,
      divisionsDiagnostics,
      teamsDiagnosticsOpen,
      divisionsDiagnosticsOpen,
      cancelConfirmationOpen,
    } = this.state;

    const { games, teamCards } = schedulerResult || {};

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      divisions?.length &&
      facilities?.length &&
      teamCards?.length &&
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
                disabled={draftSaved}
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
  scheduleData: scheduling?.schedule,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      saveDraft,
      fetchFields,
      fetchEventSummary,
      fillSchedulesTable,
      onScheduleUndo,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Schedules);
