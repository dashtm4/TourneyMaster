import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { TableSchedule, Button } from 'components/common';
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
} from './helper';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import Diagnostics, { IDiagnosticsInput } from './diagnostics';
import formatTeamsDiagnostics from './diagnostics/teamsDiagnostics';
import formatDivisionsDiagnostics from './diagnostics/divisionsDiagnostics';
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
}

class Schedules extends Component<Props, State> {
  state: State = {
    teamsDiagnosticsOpen: false,
    divisionsDiagnosticsOpen: false,
  };

  componentDidMount() {
    const { facilities } = this.props;
    const facilitiesIds = facilities?.map(f => f.facilities_id);
    if (facilitiesIds?.length) this.props.fetchFields(facilitiesIds);
    this.props.fetchEventSummary('ADLNT001');
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

  render() {
    const { divisions, teams, event, eventSummary } = this.props;
    const {
      fields,
      timeSlots,
      schedulerResult,
      facilities,
      teamsDiagnostics,
      divisionsDiagnostics,
      teamsDiagnosticsOpen,
      divisionsDiagnosticsOpen,
    } = this.state;

    const { updatedGames } = schedulerResult || {};

    const loadCondition = !!(
      fields?.length &&
      updatedGames &&
      timeSlots?.length &&
      divisions?.length &&
      facilities?.length &&
      teams?.length &&
      event &&
      eventSummary?.length
    );

    return (
      <div>
        {loadCondition && (
          <TableSchedule
            fields={fields!}
            games={updatedGames!}
            timeSlots={timeSlots!}
            divisions={divisions!}
            facilities={facilities!}
            teams={teams!}
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
              />
            </>
          )}
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
