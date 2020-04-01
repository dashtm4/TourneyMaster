import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { bindActionCreators, Dispatch } from 'redux';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { ITeam, ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import Scheduler from './Scheduler';
import { ISchedulesState } from './logic/reducer';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import {
  fetchFields,
  fetchEventSummary,
  saveDraft,
  updateDraft,
  fetchSchedulesDetails,
  publishSchedulesDetails,
  updatePublishedSchedulesDetails,
  getPublishedGames,
  publishedClear,
} from './logic/actions';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { ITournamentData } from 'common/models/tournament';
import { TableSchedule, PopupExposure } from 'components/common';
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
  calculateTotalGameTime,
} from 'helpers';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IDiagnosticsInput } from './diagnostics';
import TeamsDiagnostics from './diagnostics/teamsDiagnostics';
import DivisiondsDiagnostics from './diagnostics/divisionsDiagnostics';
import formatTeamsDiagnostics, {
  ITeamsDiagnosticsProps,
} from './diagnostics/teamsDiagnostics/calculateTeamsDiagnostics';
import formatDivisionsDiagnostics, {
  IDivisionsDiagnosticsProps,
} from './diagnostics/divisionsDiagnostics/calculateDivisionsDiagnostics';
import styles from './styles.module.scss';
import {
  fillSchedulesTable,
  updateSchedulesTable,
  onScheduleUndo,
} from './logic/schedules-table/actions';
import { ISchedulesTableState } from './logic/schedules-table/schedulesTableReducer';
import {
  mapSchedulesTeamCards,
  mapScheduleData,
  mapTeamsFromSchedulesDetails,
  mapTeamCardsToSchedulesGames,
} from './mapScheduleData';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { IConfigurableSchedule, ISchedule, IPool } from 'common/models';
import { errorToast } from 'components/common/toastr/showToasts';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { TableScheduleTypes } from 'common/enums';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import SchedulesLoader, { LoaderTypeEnum } from './loader';
import { ISchedulesGame } from 'common/models/schedule/game';
import SchedulesPaper from './paper';

type PartialTournamentData = Partial<ITournamentData>;
type PartialSchedules = Partial<ISchedulesState>;
interface IMapStateToProps extends PartialTournamentData, PartialSchedules {
  schedulesTeamCards?: ITeamCard[];
  draftSaved?: boolean;
  schedulesPublished?: boolean;
  savingInProgress?: boolean;
  scheduleData?: IConfigurableSchedule | null;
  schedulesHistoryLength?: number;
  schedule?: ISchedule;
  schedulesDetails?: ISchedulesDetails[];
  anotherSchedulePublished?: boolean;
  pools?: IPool[];
}

interface IMapDispatchToProps {
  saveDraft: (
    scheduleData: ISchedule,
    scheduleDetails: ISchedulesDetails[]
  ) => void;
  updateDraft: (scheduleDetails: ISchedulesDetails[]) => void;
  getAllPools: (divisionIds: string[]) => void;
  fetchFields: (facilitiesIds: string[]) => void;
  fetchEventSummary: (eventId: string) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  updateSchedulesTable: (teamCard: ITeamCard) => void;
  onScheduleUndo: () => void;
  fetchSchedulesDetails: (scheduleId: string) => void;
  publishSchedulesDetails: (
    scheduleData: ISchedule,
    schedulesDetails: ISchedulesDetails[],
    schedulesGames: ISchedulesGame[]
  ) => void;
  publishedClear: () => void;
  updatePublishedSchedulesDetails: (
    schedulesDetails: ISchedulesDetails[],
    schedulesGames: ISchedulesGame[]
  ) => void;
  getPublishedGames: (eventId: string, scheduleId: string) => void;
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
  divisions?: IDivisionAndPoolsState;
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
  divisions?: IScheduleDivision[];
  teamsDiagnostics?: IDiagnosticsInput;
  divisionsDiagnostics?: IDiagnosticsInput;
  cancelConfirmationOpen: boolean;
  isLoading: boolean;
  neccessaryDataCalculated: boolean;
  teamCardsAlreadyUpdated: boolean;
  loadingType: LoaderTypeEnum;
}

class Schedules extends Component<Props, State> {
  timer: any;
  state: State = {
    cancelConfirmationOpen: false,
    isLoading: true,
    neccessaryDataCalculated: false,
    teamCardsAlreadyUpdated: false,
    loadingType: LoaderTypeEnum.CALCULATION,
  };

  async componentDidMount() {
    const { facilities, match } = this.props;
    const { eventId, scheduleId } = match?.params;
    const facilitiesIds = facilities?.map(f => f.facilities_id);
    this.getPublishedStatus();
    this.activateLoaders(scheduleId);

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

  componentDidUpdate() {
    const { schedule, schedulesDetails, schedulesTeamCards } = this.props;
    const {
      scheduleId,
      teams,
      neccessaryDataCalculated,
      teamCardsAlreadyUpdated,
    } = this.state;

    if (!neccessaryDataCalculated && schedule) {
      this.calculateNeccessaryData();
      return;
    }

    if (!schedulesTeamCards && schedulesDetails && teams) {
      const mappedTeams = mapTeamsFromSchedulesDetails(schedulesDetails, teams);
      this.onScheduleCardsUpdate(mappedTeams);
    }

    if (
      schedulesTeamCards &&
      scheduleId &&
      schedule &&
      !teamCardsAlreadyUpdated
    ) {
      this.calculateDiagnostics();
      this.setState({ teamCardsAlreadyUpdated: true });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  activateLoaders = (scheduleId: string) => {
    this.setState({
      loadingType: scheduleId
        ? LoaderTypeEnum.LOADING
        : LoaderTypeEnum.CALCULATION,
    });

    const time = scheduleId ? 100 : 5000;

    this.timer = setTimeout(() => this.setState({ isLoading: false }), time);
  };

  getPublishedStatus = () => {
    const { event, match } = this.props;
    const { scheduleId } = match?.params;
    const eventId = event?.event_id!;

    if (scheduleId) {
      return this.props.getPublishedGames(eventId, scheduleId);
    }

    this.props.publishedClear();
  };

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
    ) {
      return;
    }

    const divisionIds = divisions.map(item => item.division_id);
    this.props.getAllPools(divisionIds);

    const timeValues = getTimeValuesFromEventSchedule(event, localSchedule);
    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);

    const mappedTeams = mapTeamsData(teams, divisions);
    const mappedFacilities = mapFacilitiesData(facilities);

    const mappedDivisions = mapDivisionsData(divisions);

    return this.setState({
      games,
      timeSlots,
      divisions: mappedDivisions,
      fields: sortedFields,
      teams: mappedTeams,
      facilities: mappedFacilities,
      neccessaryDataCalculated: true,
    });
  };

  calculateSchedules = () => {
    const { fields, teams, games, timeSlots, facilities } = this.state;
    const { divisions, scheduleData } = this.props;

    if (
      !scheduleData ||
      !fields ||
      !teams ||
      !games ||
      !timeSlots ||
      !facilities
    )
      return;

    const mappedDivisions = mapDivisionsData(divisions!);
    const gameOptions = setGameOptions(scheduleData);

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

    this.onScheduleCardsUpdate(schedulerResult.teamCards);
  };

  calculateDiagnostics = () => {
    const { fields, games, divisions, facilities } = this.state;
    const { schedulesTeamCards, scheduleData, schedule, event } = this.props;

    const localSchedule = scheduleData || schedule;

    if (
      !schedulesTeamCards ||
      !fields ||
      !games ||
      !divisions ||
      !facilities ||
      !event ||
      !localSchedule
    ) {
      return;
    }

    const timeValues = getTimeValuesFromEventSchedule(event, localSchedule);
    const totalGameTime = calculateTotalGameTime(
      timeValues.preGameWarmup,
      timeValues.periodDuration,
      timeValues.timeBtwnPeriods,
      timeValues.periodsPerGame
    );

    const diagnosticsProps: ITeamsDiagnosticsProps = {
      teamCards: schedulesTeamCards,
      fields,
      games,
      divisions,
      totalGameTime,
    };

    const divisionsDiagnosticsProps: IDivisionsDiagnosticsProps = {
      ...diagnosticsProps,
      facilities,
    };

    const teamsDiagnostics = formatTeamsDiagnostics(diagnosticsProps);

    const divisionsDiagnostics = formatDivisionsDiagnostics(
      divisionsDiagnosticsProps
    );

    this.setState({
      teamsDiagnostics,
      divisionsDiagnostics,
    });
  };

  openCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: true });

  closeCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: false });

  onClose = () => {
    this.openCancelConfirmation();
  };

  onExit = () => {
    this.props.history.goBack();
  };

  getSchedule = () => {
    const { schedule, scheduleData } = this.props;
    return scheduleData ? mapScheduleData(scheduleData) : schedule;
  };

  retrieveSchedulesDetails = async (isDraft: boolean) => {
    const { schedulesDetails, schedulesTeamCards } = this.props;
    const { games } = this.state;

    const localSchedule = this.getSchedule();

    if (!games || !schedulesTeamCards || !localSchedule) {
      throw errorToast('Failed to retrieve schedules data');
    }

    const schedulesTableGames = settleTeamsPerGames(games, schedulesTeamCards);

    return mapSchedulesTeamCards(
      localSchedule,
      schedulesTableGames,
      isDraft,
      schedulesDetails
    );
  };

  retrieveSchedulesGames = async () => {
    const { games } = this.state;
    const { schedulesTeamCards } = this.props;
    const localSchedule = this.getSchedule();

    if (!localSchedule || !games || !schedulesTeamCards) {
      throw errorToast('Failed to retrieve schedules data');
    }

    const schedulesTableGames = settleTeamsPerGames(games, schedulesTeamCards);
    return mapTeamCardsToSchedulesGames(localSchedule, schedulesTableGames);
  };

  onSaveDraft = async () => {
    const { draftSaved } = this.props;
    const { scheduleId, cancelConfirmationOpen } = this.state;
    const localSchedule = this.getSchedule();

    const schedulesDetails = await this.retrieveSchedulesDetails(true);

    if (!localSchedule || !schedulesDetails) {
      throw errorToast('Failed to save schedules data');
    }

    if (!scheduleId && !draftSaved) {
      this.updateUrlWithScheduleId();
      this.props.saveDraft(localSchedule, schedulesDetails);
    } else {
      this.props.updateDraft(schedulesDetails);
    }

    if (cancelConfirmationOpen) {
      this.closeCancelConfirmation();
      this.onExit();
    }
  };

  saveAndPublish = async () => {
    const { schedulesPublished } = this.props;
    const schedulesDetails = await this.retrieveSchedulesDetails(false);
    const schedulesGames = await this.retrieveSchedulesGames();
    const localSchedule = this.getSchedule();

    if (!schedulesDetails || !schedulesGames || !localSchedule) {
      throw errorToast('Failed to save schedules data');
    }

    if (schedulesPublished) {
      this.props.updatePublishedSchedulesDetails(
        schedulesDetails,
        schedulesGames
      );
      return;
    }

    this.updateUrlWithScheduleId();
    this.props.publishSchedulesDetails(
      localSchedule,
      schedulesDetails,
      schedulesGames
    );
  };

  updateUrlWithScheduleId = () => {
    const { event } = this.props;
    const localSchedule = this.getSchedule();
    const eventId = event?.event_id;
    const scheduleId = localSchedule?.schedule_id;
    const url = `/schedules/${eventId}/${scheduleId}`;
    this.props.history.push(url);
  };

  onScheduleCardsUpdate = (teamCards: ITeamCard[]) => {
    this.props.fillSchedulesTable(teamCards);
  };

  onScheduleCardUpdate = (teamCard: ITeamCard) => {
    this.props.updateSchedulesTable(teamCard);
  };

  render() {
    const {
      divisions,
      event,
      eventSummary,
      schedulesTeamCards,
      onScheduleUndo,
      schedulesHistoryLength,
      savingInProgress,
      scheduleData,
      pools,
      anotherSchedulePublished,
    } = this.props;

    const {
      fields,
      timeSlots,
      games,
      facilities,
      isLoading,
      teamsDiagnostics,
      divisionsDiagnostics,
      cancelConfirmationOpen,
      loadingType,
    } = this.state;

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      divisions?.length &&
      facilities?.length &&
      pools?.length &&
      event &&
      eventSummary?.length &&
      schedulesTeamCards?.length
    );

    const scheduleName = this.getSchedule()?.schedule_name || '';

    return (
      <div className={styles.container}>
        <div className={styles.diagnosticsContainer}>
          {teamsDiagnostics && (
            <TeamsDiagnostics teamsDiagnostics={teamsDiagnostics} />
          )}
          {divisionsDiagnostics && (
            <DivisiondsDiagnostics
              divisionsDiagnostics={divisionsDiagnostics}
            />
          )}
        </div>

        <SchedulesPaper
          scheduleName={scheduleName}
          anotherSchedulePublished={anotherSchedulePublished}
          savingInProgress={savingInProgress}
          onClose={this.onClose}
          onSaveDraft={this.onSaveDraft}
          onUnpublish={() => {}}
          saveAndPublish={this.saveAndPublish}
        />

        {loadCondition && !isLoading ? (
          <TableSchedule
            tableType={TableScheduleTypes.SCHEDULES}
            event={event!}
            fields={fields!}
            pools={pools!}
            games={games!}
            timeSlots={timeSlots!}
            divisions={divisions!}
            facilities={facilities!}
            teamCards={schedulesTeamCards!}
            eventSummary={eventSummary!}
            scheduleData={scheduleData!}
            historyLength={schedulesHistoryLength}
            onTeamCardsUpdate={this.onScheduleCardsUpdate}
            onTeamCardUpdate={this.onScheduleCardUpdate}
            onUndo={onScheduleUndo}
          />
        ) : (
          <div className={styles.loadingWrapper}>
            <SchedulesLoader type={loadingType} time={5000} />
          </div>
        )}

        <PopupExposure
          isOpen={cancelConfirmationOpen}
          onClose={this.closeCancelConfirmation}
          onExitClick={this.onExit}
          onSaveClick={this.onSaveDraft}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  schedules,
  scheduling,
  schedulesTable,
  divisions,
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
  schedulesPublished: schedules?.schedulesPublished,
  anotherSchedulePublished: schedules?.anotherSchedulePublished,
  savingInProgress: schedules?.savingInProgress,
  scheduleData: scheduling?.schedule,
  schedule: schedules?.schedule,
  schedulesDetails: schedules?.schedulesDetails,
  pools: divisions?.pools,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      saveDraft,
      updateDraft,
      fetchFields,
      fetchEventSummary,
      fillSchedulesTable,
      updateSchedulesTable,
      publishSchedulesDetails,
      updatePublishedSchedulesDetails,
      getPublishedGames,
      publishedClear,
      onScheduleUndo,
      fetchSchedulesDetails,
      getAllPools,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Schedules);
