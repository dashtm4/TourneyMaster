import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IFetchedTeam } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import Scheduler from './Scheduler';
import { ISchedulesState } from './logic/reducer';
import { IFetchedDivision } from 'common/models/schedule/divisions';
import { fetchFields, fetchEventSummary } from './logic/actions';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { ITournamentData } from 'common/models/tournament';
import { TableSchedule } from 'components/common';

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
  teams?: IFetchedTeam[];
  fields?: IField[];
  schedulerResult?: Scheduler;
  divisions?: IFetchedDivision[];
  teamsDiagnosticsOpen: boolean;
  divisionsDiagnosticsOpen: boolean;
}

class Schedules extends Component<Props, State> {
  state = {
    teamsDiagnosticsOpen: false,
    divisionsDiagnosticsOpen: false,
  };

  componentDidMount() {
    const { facilities } = this.props;
    const facilitiesIds = facilities?.map(f => f.facilities_id);
    if (facilitiesIds?.length) this.props.fetchFields(facilitiesIds);
    this.props.fetchEventSummary('ADLNT001');
  }

  render() {
    const { divisions, teams, event, eventSummary } = this.props;

    return (
      <div>
        {!!(
          divisions?.length &&
          teams?.length &&
          event &&
          eventSummary?.length
        ) && (
          <TableSchedule
            divisions={divisions}
            teams={teams}
            eventSummary={eventSummary}
          />
        )}
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
// import React, { Component } from 'react';
// import api from 'api/api';
// import {
//   mapTeamsData,
//   mapFieldsData,
//   mapFacilitiesData,
//   mapDivisionsData,
// } from './mapTournamentData';
// import { IFetchedTeam, ITeam } from 'common/models/schedule/teams';
// import {
//   IFetchedDivision,
//   IScheduleDivision,
// } from 'common/models/schedule/divisions';
// import { IScheduleFacility } from 'common/models/schedule/facilities';
// import { IFacility as IFetchedFacility } from 'common/models/facilities';
// import { IField } from 'common/models/schedule/fields';
// import { IField as IFetchedField } from 'common/models/field';
// import { EventDetailsDTO } from 'components/event-details/logic/model';
// import {
//   calculateTimeSlots,
//   getTimeValuesFromEvent,
//   setGameOptions,
// } from './helper';
// // import SchedulesMatrix from 'components/common/matrix-table';
// import Scheduler, { IGameOptions } from './Scheduler';
// import Diagnostics from './diagnostics';
// import { Button, Loader, TableSchedule } from 'components/common';
// import {
//   sortFieldsByPremier,
//   defineGames,
//   IDefinedGames,
// } from 'components/common/matrix-table/helper';
// import formatTeamsDiagnostics from './diagnostics/teamsDiagnostics';
// import formatDivisionsDiagnostics from './diagnostics/divisionsDiagnostics';

// export interface ITimeSlot {
//   id: number;
//   time: string;
// }

// interface IState {
//   timeSlots?: ITimeSlot[];
//   teams?: ITeam[];
//   fields?: IField[];
//   gameOptions?: IGameOptions;
//   teamsDiagnosticsOpen: boolean;
//   divisionsDiagnosticsOpen: boolean;
//   scheduling?: ISchedulerResult;
//   divisions?: IScheduleDivision[];
//   facilities?: IScheduleFacility[];
// }

// export interface ISchedulerResult extends Scheduler {
//   gameFields: number;
// }

// interface IProps {
//   match: any;
// }

// class Schedules extends Component<IProps, IState> {
//   state: IState = {
//     teamsDiagnosticsOpen: false,
//     divisionsDiagnosticsOpen: false,
//   };

//   async componentDidMount() {
//     const { eventId } = this.props.match?.params;

//     const fetchedEvents: EventDetailsDTO[] = await api.get(
//       `/events?event_id=${eventId}`
//     );
//     const fetchedEvent = fetchedEvents[0];

//     const gameOptions = setGameOptions(fetchedEvent);
//     const timeValues = getTimeValuesFromEvent(fetchedEvent);
//     const timeSlots = calculateTimeSlots(timeValues);

//     const fetchedTeams: IFetchedTeam[] = await api.get(
//       `/teams?event_id=${eventId}`
//     );
//     const fetchedDivisions: IFetchedDivision[] = await api.get(
//       `/divisions?event_id=${eventId}`
//     );

//     const fetchedFacilities: IFetchedFacility[] = await api.get(
//       `/facilities?event_id=${eventId}`
//     );

//     const fetchedFields: IFetchedField[] = [];
//     await Promise.all(
//       fetchedFacilities.map(async ff => {
//         const fields = await api.get(
//           `/fields?facilities_id=${ff.facilities_id}`
//         );
//         if (fields?.length) fetchedFields.push(...fields);
//       })
//     );

//     const mappedTeams: ITeam[] = mapTeamsData(fetchedTeams, fetchedDivisions);
//     const mappedFields: IField[] = mapFieldsData(fetchedFields);
//     const mappedFacilities: IScheduleFacility[] = mapFacilitiesData(
//       fetchedFacilities
//     );
//     const mappedDivisions: IScheduleDivision[] = mapDivisionsData(
//       fetchedDivisions
//     );

//     this.setState({
//       timeSlots,
//       gameOptions,
//       teams: mappedTeams,
//       fields: mappedFields,
//       divisions: mappedDivisions,
//       facilities: mappedFacilities,
//     });

//     this.scheduling();
//   }

//   scheduling = () => {
//     const {
//       teams,
//       fields,
//       timeSlots,
//       facilities,
//       divisions,
//       gameOptions,
//     } = this.state;
//     const sortedFields = sortFieldsByPremier(fields!);

//     const definedGames: IDefinedGames = defineGames(
//       sortedFields,
//       timeSlots!,
//       teams!
//     );
//     const { gameFields, games } = definedGames;

//     if (!divisions || !facilities || !gameOptions) return;

//     const tournamentBaseInfo = {
//       facilities,
//       divisions,
//       gameOptions,
//     };

//     const scheduling: Scheduler = new Scheduler(
//       sortedFields,
//       teams!,
//       games,
//       timeSlots!,
//       tournamentBaseInfo
//     );

//     this.setState({
//       scheduling: {
//         ...scheduling,
//         gameFields,
//       },
//     });
//   };

//   toggleTeamsDiagnostics = () => {
//     this.setState(({ teamsDiagnosticsOpen }) => ({
//       teamsDiagnosticsOpen: !teamsDiagnosticsOpen,
//     }));
//   };

//   toggleDivisionDiagnostics = () =>
//     this.setState(({ divisionsDiagnosticsOpen }) => ({
//       divisionsDiagnosticsOpen: !divisionsDiagnosticsOpen,
//     }));

//   render() {
//     const {
//       timeSlots,
//       teams,
//       fields,
//       teamsDiagnosticsOpen,
//       divisionsDiagnosticsOpen,
//       scheduling,
//       divisions,
//     } = this.state;

//     let teamsTableData;
//     let divisionsTableData;

//     if (scheduling) {
//       teamsTableData = formatTeamsDiagnostics(scheduling);
//       divisionsTableData = formatDivisionsDiagnostics(scheduling);
//       console.log('scheduler', scheduling);
//     }

//     return (
//       <div>
//         {(!teams?.length || !fields?.length) && <Loader />}
//         {teamsTableData && teamsTableData?.body?.length && (
//           <>
//             <Button
//               label="Open Teams Diagnostics"
//               onClick={this.toggleTeamsDiagnostics}
//               variant="contained"
//               color="primary"
//             />
//             <Diagnostics
//               tableData={teamsTableData}
//               isOpen={teamsDiagnosticsOpen}
//               onClose={this.toggleTeamsDiagnostics}
//             />
//           </>
//         )}

//         {divisionsTableData && divisionsTableData?.body?.length && (
//           <>
//             <Button
//               label="Open Divisions Diagnostics"
//               onClick={this.toggleDivisionDiagnostics}
//               variant="contained"
//               color="primary"
//             />
//             <Diagnostics
//               tableData={divisionsTableData}
//               isOpen={divisionsDiagnosticsOpen}
//               onClose={this.toggleDivisionDiagnostics}
//             />
//           </>
//         )}

//         {teams?.length &&
//           timeSlots?.length &&
//           fields?.length &&
//           scheduling?.updatedGames && (
//             <TableSchedule
//               divisions={divisions}
//               teams={teams}
//               eventSummary={}
//             />
//           )}
//         {/* {teams?.length &&
//           timeSlots?.length &&
//           fields?.length &&
//           scheduling?.updatedGames && (
//             <SchedulesMatrix
//               // scheduling={scheduling}
//               timeSlots={timeSlots}
//               fields={fields}
//               teams={teams}
//               isHeatmap={false}
//             />
//           )} */}
//       </div>
//     );
//   }
// }

// export default Schedules;
