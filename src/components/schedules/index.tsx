import React, { Component } from 'react';
import api from 'api/api';
import {
  mapTeamsData,
  mapFieldsData,
  mapFacilitiesData,
  mapDivisionsData,
} from './mapTournamentData';
import { IFetchedTeam, ITeam } from 'common/models/schedule/teams';
import {
  IFetchedDivision,
  IScheduleDivision,
} from 'common/models/schedule/divisions';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IFacility as IFetchedFacility } from 'common/models/facilities';
import { IField } from 'common/models/schedule/fields';
import { IField as IFetchedField } from 'common/models/field';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import {
  calculateTimeSlots,
  getTimeValuesFromEvent,
  setGameOptions,
} from './helper';
import SchedulesMatrix from './matrix';
import Scheduler, { IGameOptions } from './matrix/Scheduler';
import Diagnostics from './diagnostics';
import { Button } from 'components/common';
import {
  sortFieldsByPremier,
  defineGames,
  IDefinedGames,
} from './matrix/helper';
import formatTeamsDiagnostics from './diagnostics/teamsDiagnostics';
import formatDivisionsDiagnostics from './diagnostics/divisionsDiagnostics';

export interface ITimeSlot {
  id: number;
  time: string;
}

interface IState {
  timeSlots?: ITimeSlot[];
  teams?: ITeam[];
  fields?: IField[];
  gameOptions?: IGameOptions;
  teamsDiagnosticsOpen: boolean;
  divisionsDiagnosticsOpen: boolean;
  scheduling?: ISchedulerResult;
  divisions?: IScheduleDivision[];
  facilities?: IScheduleFacility[];
}

export interface ISchedulerResult extends Scheduler {
  gameFields: number;
}

class Schedules extends Component<{}, IState> {
  state: IState = {
    teamsDiagnosticsOpen: false,
    divisionsDiagnosticsOpen: false,
  };

  async componentDidMount() {
    const fetchedEvents: EventDetailsDTO[] = await api.get(
      '/events?event_id=ADLNT001'
    );
    const fetchedEvent = fetchedEvents[0];

    const gameOptions = setGameOptions(fetchedEvent);
    const timeValues = getTimeValuesFromEvent(fetchedEvent);
    const timeSlots = calculateTimeSlots(timeValues);

    const fetchedTeams: IFetchedTeam[] = await api.get(
      '/teams?event_id=ADLNT001'
    );
    const fetchedDivisions: IFetchedDivision[] = await api.get(
      '/divisions?event_id=ADLNT001'
    );

    const fetchedFacilities: IFetchedFacility[] = await api.get(
      '/facilities?event_id=ADLNT001'
    );

    const fetchedFields: IFetchedField[] = [];
    await Promise.all(
      fetchedFacilities.map(async ff => {
        const fields = await api.get(
          `/fields?facilities_id=${ff.facilities_id}`
        );
        if (fields?.length) fetchedFields.push(...fields);
      })
    );

    const mappedTeams: ITeam[] = mapTeamsData(fetchedTeams, fetchedDivisions);
    const mappedFields: IField[] = mapFieldsData(fetchedFields);
    const mappedFacilities: IScheduleFacility[] = mapFacilitiesData(
      fetchedFacilities
    );
    const mappedDivisions: IScheduleDivision[] = mapDivisionsData(
      fetchedDivisions
    );

    this.setState({
      timeSlots,
      gameOptions,
      teams: mappedTeams,
      fields: mappedFields,
      divisions: mappedDivisions,
      facilities: mappedFacilities,
    });

    this.scheduling();
  }

  scheduling = () => {
    const {
      teams,
      fields,
      timeSlots,
      facilities,
      divisions,
      gameOptions,
    } = this.state;
    const sortedFields = sortFieldsByPremier(fields!);

    const definedGames: IDefinedGames = defineGames(
      sortedFields,
      timeSlots!,
      teams!
    );
    const { gameFields, games } = definedGames;

    if (!divisions || !facilities || !gameOptions) return;

    const tournamentBaseInfo = {
      facilities,
      divisions,
      gameOptions,
    };

    const scheduling: Scheduler = new Scheduler(
      sortedFields,
      teams!,
      games,
      timeSlots!,
      tournamentBaseInfo
    );

    this.setState({
      scheduling: {
        ...scheduling,
        gameFields,
      },
    });
  };

  toggleTeamsDiagnostics = () => {
    this.setState(({ teamsDiagnosticsOpen }) => ({
      teamsDiagnosticsOpen: !teamsDiagnosticsOpen,
    }));
  };

  toggleDivisionDiagnostics = () =>
    this.setState(({ divisionsDiagnosticsOpen }) => ({
      divisionsDiagnosticsOpen: !divisionsDiagnosticsOpen,
    }));

  render() {
    const {
      timeSlots,
      teams,
      fields,
      teamsDiagnosticsOpen,
      divisionsDiagnosticsOpen,
      scheduling,
    } = this.state;

    let teamsTableData;
    let divisionsTableData;

    if (scheduling) {
      teamsTableData = formatTeamsDiagnostics(scheduling);
      divisionsTableData = formatDivisionsDiagnostics(scheduling);
      console.log('scheduler', scheduling);
    }

    return (
      <div>
        {teamsTableData && teamsTableData?.body?.length && (
          <>
            <Button
              label="Open Teams Diagnostics"
              onClick={this.toggleTeamsDiagnostics}
              variant="contained"
              color="primary"
            />
            <Diagnostics
              tableData={teamsTableData}
              isOpen={teamsDiagnosticsOpen}
              onClose={this.toggleTeamsDiagnostics}
            />
          </>
        )}

        {divisionsTableData && divisionsTableData?.body?.length && (
          <>
            <Button
              label="Open Divisions Diagnostics"
              onClick={this.toggleDivisionDiagnostics}
              variant="contained"
              color="primary"
            />
            <Diagnostics
              tableData={divisionsTableData}
              isOpen={divisionsDiagnosticsOpen}
              onClose={this.toggleDivisionDiagnostics}
            />
          </>
        )}

        {teams?.length &&
          timeSlots?.length &&
          fields?.length &&
          scheduling?.updatedGames && (
            <SchedulesMatrix
              scheduling={scheduling}
              timeSlots={timeSlots}
              fields={fields}
              teams={teams}
            />
          )}
      </div>
    );
  }
}

export default Schedules;
