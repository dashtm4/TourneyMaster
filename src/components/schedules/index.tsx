import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { bindActionCreators, Dispatch } from 'redux';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { ITeam } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import Scheduler from './Scheduler';
import { ISchedulesState } from './logic/reducer';
import {
  IFetchedDivision,
  IScheduleDivision,
} from 'common/models/schedule/divisions';
import { fetchFields, fetchEventSummary } from './logic/actions';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { ITournamentData } from 'common/models/tournament';
import { TableSchedule, Button, Paper, PopupExposure } from 'components/common';
import {
  defineGames,
  IDefinedGames,
  sortFieldsByPremier,
} from 'components/common/matrix-table/helper';
import {
  mapFieldsData,
  mapTeamsData,
  mapFacilitiesData,
  mapDivisionsData,
} from './mapTournamentData';
import {
  getTimeValuesFromEvent,
  calculateTimeSlots,
  setGameOptions,
} from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import Diagnostics, { IDiagnosticsInput } from './diagnostics';
import formatTeamsDiagnostics from './diagnostics/teamsDiagnostics';
import formatDivisionsDiagnostics from './diagnostics/divisionsDiagnostics';
import { DiagnosticTypes } from './types';
import styles from './styles.module.scss';

type PartialTournamentData = Partial<ITournamentData>;
type PartialSchedules = Partial<ISchedulesState>;
interface IMapStateToProps extends PartialTournamentData, PartialSchedules {}

interface IMapDispatchToProps {
  fetchFields: (facilitiesIds: string[]) => void;
  fetchEventSummary: (eventId: string) => void;
}

interface ComponentProps {
  match: any;
  history: History;
}

interface IRootState {
  pageEvent?: IPageEventState;
  schedules?: ISchedulesState;
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
}

class Schedules extends Component<Props, State> {
  state: State = {
    teamsDiagnosticsOpen: false,
    divisionsDiagnosticsOpen: false,
    cancelConfirmationOpen: false,
  };

  componentDidMount() {
    const { facilities, match } = this.props;
    const { eventId } = match?.params;
    const facilitiesIds = facilities?.map(f => f.facilities_id);

    if (facilitiesIds?.length) {
      this.props.fetchFields(facilitiesIds);
    }

    this.props.fetchEventSummary(eventId);
    this.calculateSchedules();
  }

  calculateSchedules = () => {
    const { fields, event, teams, divisions, facilities } = this.props;

    if (
      !fields?.length ||
      !teams?.length ||
      !facilities?.length ||
      !divisions?.length ||
      !event
    )
      return;

    const timeValues = getTimeValuesFromEvent(event);
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

  onSaveDraft = () => {
    const { cancelConfirmationOpen } = this.state;

    if (cancelConfirmationOpen) {
      this.closeCancelConfirmation();
      this.onExit();
    }
  };

  render() {
    const { divisions, event, eventSummary } = this.props;
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
      eventSummary?.length
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
                onClick={this.onSaveDraft}
              />
            </div>
          </Paper>
        </div>

        {loadCondition && (
          <TableSchedule
            fields={fields!}
            games={games!}
            timeSlots={timeSlots!}
            divisions={divisions!}
            facilities={facilities!}
            teamCards={teamCards!}
            eventSummary={eventSummary!}
          />
        )}

        <div className={styles.diagnosticsContainer}>
          {loadCondition && teamsDiagnostics && (
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

          {loadCondition && divisionsDiagnostics && (
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

const mapStateToProps = ({ pageEvent, schedules }: IRootState) => ({
  event: pageEvent?.tournamentData.event,
  facilities: pageEvent?.tournamentData.facilities,
  divisions: pageEvent?.tournamentData.divisions,
  teams: pageEvent?.tournamentData.teams,
  fields: pageEvent?.tournamentData.fields,
  eventSummary: schedules?.eventSummary,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchFields,
      fetchEventSummary,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Schedules);
