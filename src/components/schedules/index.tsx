import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import api from 'api/api';
import { chunk, merge } from 'lodash-es';
import { History } from 'history';
import {
  calculateTimeSlots,
  setGameOptions,
  getTimeValuesFromEventSchedule,
  calculateTotalGameTime,
  calculateTournamentDays,
  getTimeValuesFromSchedule,
  ITimeValues,
} from 'helpers';
import {
  TableScheduleTypes,
  ScheduleStatuses,
  TimeSlotsEntityTypes,
} from 'common/enums';
import {
  IConfigurableSchedule,
  ISchedule,
  IPool,
  BindingAction,
  ScheduleCreationType,
} from 'common/models';
import { ITournamentData } from 'common/models/tournament';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { ISchedulesGame } from 'common/models/schedule/game';
import { ITeam, ITeamCard } from 'common/models/schedule/teams';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { TableSchedule, PopupExposure } from 'components/common';
import { errorToast } from 'components/common/toastr/showToasts';
import {
  defineGames,
  sortFieldsByPremier,
  settleTeamsPerGames,
  IGame,
  settleTeamsPerGamesDays,
} from 'components/common/matrix-table/helper';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { IDivisionAndPoolsState } from 'components/divisions-and-pools/logic/reducer';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import { ISchedulingState } from 'components/scheduling/logic/reducer';
import { ISchedulesState } from './logic/reducer';
import {
  fetchFields,
  fetchEventSummary,
  saveDraft,
  updateDraft,
  fetchSchedulesDetails,
  publishSchedulesDetails,
  updatePublishedSchedulesDetails,
  schedulesSavingInProgress,
  getPublishedGames,
  publishedClear,
  publishedSuccess,
  createSchedule,
  updateSchedule,
  schedulesDetailsClear,
  updateSchedulesDetails,
  deleteSchedulesDetails,
  addSchedulesDetails,
  setIsAlreadyDraftSaveStatus,
} from './logic/actions';
import {
  fillSchedulesTable,
  updateSchedulesTable,
  onScheduleUndo,
  clearSchedulesTable,
} from './logic/schedules-table/actions';
import Scheduler from './Scheduler';
import {
  mapFieldsData,
  mapTeamsData,
  mapFacilitiesData,
  mapDivisionsData,
} from './mapTournamentData';
import { IDiagnosticsInput } from './diagnostics';
import formatTeamsDiagnostics, {
  ITeamsDiagnosticsProps,
} from './diagnostics/teamsDiagnostics/calculateTeamsDiagnostics';
import formatDivisionsDiagnostics, {
  IDivisionsDiagnosticsProps,
} from './diagnostics/divisionsDiagnostics/calculateDivisionsDiagnostics';
import { ISchedulesTableState } from './logic/schedules-table/schedulesTableReducer';
import {
  mapSchedulesTeamCards,
  mapScheduleData,
  mapTeamsFromSchedulesDetails,
  mapTeamCardsToSchedulesGames,
} from './mapScheduleData';
import SchedulesLoader, { LoaderTypeEnum } from './loader';
import SchedulesPaper from './paper';
import {
  populateDefinedGamesWithPlayoffState,
  predictPlayoffTimeSlots,
} from './definePlayoffs';
import styles from './styles.module.scss';
import VisualGamesMaker from 'components/visual-games-maker';
import { IMatchup } from '../visual-games-maker/helpers';
import uuidv4 from 'uuid/v4';

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
  gamesAlreadyExist?: boolean;
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
  publishedSuccess: () => void;
  updatePublishedSchedulesDetails: (
    schedulesDetails: ISchedulesDetails[],
    schedulesGames: ISchedulesGame[]
  ) => void;
  clearSchedulesTable: () => void;
  getPublishedGames: (eventId: string, scheduleId?: string) => void;
  schedulesSavingInProgress: (payload: boolean) => void;
  //
  createSchedule: (
    schedule: ISchedule,
    schedulesDetails: ISchedulesDetails[]
  ) => void;
  updateSchedule: (
    schedule: ISchedule,
    schedulesDetails: ISchedulesDetails[]
  ) => void;
  schedulesDetailsClear: () => void;
  updateSchedulesDetails: (
    modifiedSchedulesDetails: ISchedulesDetails[],
    schedulesDetailsToModify: ISchedulesDetails[]
  ) => void;
  deleteSchedulesDetails: (modifiedSchedulesDetails: ISchedulesDetails[], schedulesDetailsToDelete: ISchedulesDetails[]) => void;
  addSchedulesDetails: (modifiedSchedulesDetails: ISchedulesDetails[], schedulesDetailsToAdd: ISchedulesDetails[]) => void;
  setIsAlreadyDraftSaveStatus: (isAlreadyDraftSave: boolean) => void;
}

interface ComponentProps {
  match: any;
  history: History;
  isFullScreen: boolean;
  onToggleFullScreen: BindingAction;
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
  gamesCells: IMatchup[];
  scheduleId?: string;
  timeSlots?: ITimeSlot[];
  timeValues?: ITimeValues;
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
  defaultTabUpdated: boolean;
  loadingType: LoaderTypeEnum;
  tournamentDays: string[];
  playoffTimeSlots: ITimeSlot[];
  activeTab: SchedulesTabsEnum;
  vgmShowTeamsNames: boolean;
}

enum SchedulesTabsEnum {
  None = 0,
  VisualGamesMaker = 1,
  Schedules = 2,
}

class Schedules extends Component<Props, State> {
  timer: any;
  state: State = {
    cancelConfirmationOpen: false,
    gamesCells: [],
    isLoading: true,
    neccessaryDataCalculated: false,
    teamCardsAlreadyUpdated: false,
    defaultTabUpdated: false,
    loadingType: LoaderTypeEnum.CALCULATION,
    tournamentDays: [],
    playoffTimeSlots: [],
    activeTab: SchedulesTabsEnum.Schedules,
    vgmShowTeamsNames: true,
  };

  async componentDidMount() {
    const {
      facilities,
      match,
      scheduleData,
      schedulesDetailsClear,
      clearSchedulesTable,
      fetchFields,
      fetchEventSummary,
      fetchSchedulesDetails,
      setIsAlreadyDraftSaveStatus,
    } = this.props;
    setIsAlreadyDraftSaveStatus(false);
    const { eventId, scheduleId } = match?.params;
    const facilitiesIds = facilities?.map(f => f.facilities_id);
    const { create_mode } = scheduleData || {};
    const isManualScheduling =
      !create_mode ||
      ScheduleCreationType[create_mode] === ScheduleCreationType.Manual ||
      ScheduleCreationType[create_mode] === ScheduleCreationType.Visual;

    schedulesDetailsClear();
    clearSchedulesTable();
    this.getPublishedStatus();
    this.activateLoaders(scheduleId, isManualScheduling);
    this.calculateTournamentDays();

    if (facilitiesIds?.length) {
      fetchFields(facilitiesIds);
    }

    fetchEventSummary(eventId);

    if (scheduleId) {
      this.setState({ scheduleId });
      fetchSchedulesDetails(scheduleId);
    } else {
      await this.calculateNeccessaryData();

      if (this.isVisualGamesMakerMode()) {
        this.setState({
          activeTab: SchedulesTabsEnum.VisualGamesMaker,
          defaultTabUpdated: true,
        });
      }

      if (isManualScheduling) {
        this.onScheduleCardsUpdate(
          this.state.teams?.map(item => ({
            ...item,
            games: [],
          }))!
        );
        this.calculateDiagnostics();
        return;
      }

      this.calculateSchedules();
      setTimeout(() => {
        this.calculateDiagnostics();
      }, 500);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      schedule,
      schedulesDetails,
      schedulesTeamCards,
      draftSaved,
      divisions,
    } = this.props;

    const {
      scheduleId,
      teams,
      neccessaryDataCalculated,
      teamCardsAlreadyUpdated,
      defaultTabUpdated,
      gamesCells,
    } = this.state;

    const localSchedule = this.getSchedule();

    if (!scheduleId && draftSaved) {
      this.setState({
        scheduleId: localSchedule?.schedule_id,
      });
      this.updateUrlWithScheduleId();
    }

    if (scheduleId && !schedule) {
      this.props.fetchSchedulesDetails(scheduleId);
    }

    if (this.isVisualGamesMakerMode() && schedulesDetails && JSON.stringify(this.props.schedulesDetails) !== JSON.stringify(prevProps.schedulesDetails) && gamesCells && gamesCells.length === 0) {
      const matchups: IMatchup[] = schedulesDetails
        .filter(
          v =>
            v.away_team_id !== null &&
            v.home_team_id !== null &&
            v.division_id !== null
        )
        .map(v => {
          const division = divisions?.find(d => d.division_id === v.division_id);
          return {
            id: uuidv4(),
            assignedGameId: +v.game_id > 0 ? +v.game_id : null,
            homeTeamId: v.home_team_id,
            awayTeamId: v.away_team_id,
            divisionId: v.division_id,
            divisionName: division?.short_name || '',
            divisionHex: division?.division_hex || '',
          } as IMatchup;
        });

      this.onGamesListChange(matchups);
    }

    if (!neccessaryDataCalculated && schedule) {
      this.calculateNeccessaryData();
      return;
    }

    if (
      schedulesDetails &&
      (!schedulesTeamCards ||
        schedulesDetails !== prevProps.schedulesDetails) &&
      teams &&
      scheduleId
    ) {
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

    if (schedule && !defaultTabUpdated) {
      this.setState({
        defaultTabUpdated: true,
        activeTab: this.isVisualGamesMakerMode()
          ? SchedulesTabsEnum.VisualGamesMaker
          : SchedulesTabsEnum.Schedules,
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  setPlayoffTimeSlots = () => {
    const { fields, timeSlots, divisions } = this.state;
    const { event } = this.props;

    if (!fields || !timeSlots) return;

    const playoffTimeSlots = predictPlayoffTimeSlots(
      fields,
      timeSlots,
      divisions!,
      event!
    );

    this.setState({ playoffTimeSlots });
  };

  activateLoaders = (scheduleId: string, isManualScheduling: boolean) => {
    this.setState({
      loadingType:
        scheduleId || isManualScheduling
          ? LoaderTypeEnum.LOADING
          : LoaderTypeEnum.CALCULATION,
    });

    const time = scheduleId ? 100 : 5000;

    this.timer = setTimeout(() => this.setState({ isLoading: false }), time);
  };

  getPublishedStatus = () => {
    const { event, match, getPublishedGames } = this.props;
    const { scheduleId } = match?.params;
    const eventId = event?.event_id!;

    getPublishedGames(eventId, scheduleId);
  };

  onGamesListChange = (item: IMatchup[], teamIdToDeleteGame: string = '', isDnd: boolean = false) => {
    const prevState = this.state;
    const { gamesCells } = prevState;

    this.setState({
      gamesCells: item,
    });

    if (gamesCells) {
      const deselectedGame = gamesCells.find(v => !item.includes(v));

      if (deselectedGame) {
        const { schedulesTeamCards } = this.props;

        let newTeamsCards: ITeamCard[] = [];

        if (teamIdToDeleteGame) {
          newTeamsCards = schedulesTeamCards!.map(v => {
            return {
              ...v,
              games: v.games?.filter(
                game => game.id !== deselectedGame.assignedGameId && v.id !== teamIdToDeleteGame
              ),
            };
          });
        } else {
          if (isDnd) {
            newTeamsCards = schedulesTeamCards!.map(v => {
              return {
                ...v,
                games: v.games?.filter(
                  game => game.id !== deselectedGame.assignedGameId
                ),
              };
            });
          } else {
            const gamesIdToDelete = gamesCells.filter(v => v.awayTeamId === deselectedGame.awayTeamId && v.homeTeamId === deselectedGame.homeTeamId).map(v => v.assignedGameId);
            newTeamsCards = schedulesTeamCards!.map(v => {
              return {
                ...v,
                games: v.games?.filter(
                  game => !gamesIdToDelete.includes(game.id)
                ),
              };
            });
          }
        }

        this.props.fillSchedulesTable(newTeamsCards);
      }
    }
  };

  onAddMatchup = (item: IMatchup) => {
    this.setState({
      gamesCells: [...this.state.gamesCells, item],
    });
  };

  onAssignMatchup = (id: string, assignedGameId: number | null) => {
    const item = this.state.gamesCells.find(o => o.id === id);
    if (item) {
      const filteredItems = this.state.gamesCells.filter(o => o.id !== id);
      const newItem = { ...item };
      // assign by existing game id or unassign matchup with null
      newItem.assignedGameId = assignedGameId;
      this.setState({
        gamesCells: [...filteredItems, newItem],
      });
    }
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
      match,
      schedulesDetails,
      getAllPools,
    } = this.props;

    const { scheduleId } = match.params;

    if (
      !(scheduleId ? schedule : scheduleData) ||
      !event ||
      !fields ||
      !teams ||
      !divisions ||
      !facilities
    ) {
      return;
    }

    const divisionIds = divisions.map(item => item.division_id);
    getAllPools(divisionIds);

    const timeValues =
      scheduleId && schedule
        ? getTimeValuesFromEventSchedule(event, schedule)
        : getTimeValuesFromSchedule(scheduleData!);
    const timeSlots = calculateTimeSlots(
      timeValues,
      schedulesDetails,
      TimeSlotsEntityTypes.SCHEDULE_DETAILS
    );

    const mappedFields = mapFieldsData(fields, facilities);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);

    const mappedTeams = mapTeamsData(teams, divisions);
    const mappedFacilities = mapFacilitiesData(facilities);

    const mappedDivisions = mapDivisionsData(divisions);

    return this.setState(
      {
        games,
        timeSlots,
        timeValues,
        divisions: mappedDivisions,
        fields: sortedFields,
        teams: mappedTeams,
        facilities: mappedFacilities,
        neccessaryDataCalculated: true,
      },
      () => {
        this.setPlayoffTimeSlots();
      }
    );
  };

  calculateTournamentDays = () => {
    const { event } = this.props;

    if (!event) return;

    const tournamentDays = calculateTournamentDays(event);

    this.setState({ tournamentDays });
  };

  calculateSchedules = () => {
    const {
      fields,
      teams,
      games,
      timeSlots,
      facilities,
      tournamentDays,
      playoffTimeSlots,
    } = this.state;
    const { divisions, scheduleData } = this.props;

    if (
      !playoffTimeSlots ||
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
      teamsInPlay: undefined,
    };

    const updateTeamsDayInfo = (teamCards: ITeamCard[], date: string) =>
      teamCards.map(item => ({
        ...item,
        games: [
          ...(item?.games?.map(game => ({
            ...game,
            date: game.date || date,
          })) || []),
        ],
      }));

    const updateTeamGamesDateInfo = (games: any[], date: string) => [
      ...games.map(game => ({ ...game, date })),
    ];

    let teamsInPlay = {};
    let teamcards: ITeamCard[] = [];
    let schedulerResult: Scheduler;

    /* Truncate gameslots and timeslots for the last day by the number of playoff timeslots */

    tournamentDays.forEach(day => {
      let definedGames = [...games];
      if (tournamentDays[tournamentDays.length - 1] === day) {
        definedGames = populateDefinedGamesWithPlayoffState(
          games,
          playoffTimeSlots
        );
      }

      const result = new Scheduler(fields, teams, definedGames, timeSlots, {
        ...tournamentBaseInfo,
        teamsInPlay,
      });

      if (!schedulerResult) {
        schedulerResult = result;
      }

      teamsInPlay = merge(teamsInPlay, result.teamsInPlay);

      const resultTeams = result.teamCards;

      teamcards = teamcards.length
        ? teamcards.map(item => ({
          ...item,
          games: [
            ...(item.games || []),
            ...(updateTeamGamesDateInfo(
              resultTeams.find(team => team.id === item.id)?.games || [],
              day
            ) || []),
          ],
        }))
        : updateTeamsDayInfo(resultTeams, day);
    });

    this.setState({
      playoffTimeSlots,
      schedulerResult: schedulerResult!,
    });

    this.onScheduleCardsUpdate(teamcards);
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
    const { schedulesHistoryLength } = this.props;
    if ((schedulesHistoryLength || 0) > 1) {
      this.openCancelConfirmation();
    } else {
      this.onExit();
    }
  };

  onExit = () => {
    const { event, history } = this.props;
    const eventId = event?.event_id;
    history.push(`/event/scheduling/${eventId}`);
  };

  getSchedule = () => {
    const { schedule, scheduleData, match } = this.props;
    const { scheduleId } = match.params;
    return scheduleId ? schedule : mapScheduleData(scheduleData!);
  };

  getConfigurableSchedule = () => this.props.scheduleData;

  retrieveSchedulesDetails = async (isDraft: boolean, type: 'POST' | 'PUT') => {
    const { schedulesDetails, schedulesTeamCards } = this.props;
    const { games, gamesCells, tournamentDays } = this.state;

    const localSchedule = this.getSchedule();

    if (!games || !schedulesTeamCards || !localSchedule) {
      throw errorToast('Failed to retrieve schedules data');
    }

    let schedulesTableGames = [];
    for (const day of tournamentDays) {
      schedulesTableGames.push(
        settleTeamsPerGamesDays(games, schedulesTeamCards, day)
      );
    }

    const unassignedGames = gamesCells.filter(g => !g.assignedGameId);
    if (unassignedGames.length > 0) {
      schedulesTableGames.push(
        unassignedGames.map(v => ({
          gameId: null,
          divisionId: v.divisionId,
          awayTeamId: v.awayTeamId,
          homeTeamId: v.homeTeamId,
        }))
      );
    }

    schedulesTableGames = schedulesTableGames.flat();

    return mapSchedulesTeamCards(
      localSchedule,
      schedulesTableGames,
      isDraft,
      type === 'POST' ? undefined : schedulesDetails
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

  save = async () => {
    const { schedulesDetails, updateSchedule, createSchedule } = this.props;
    const { gamesCells, scheduleId, cancelConfirmationOpen } = this.state;
    const schedule = this.getSchedule();

    if (!schedule) return;

    const updatedSchedulesDetails = await this.retrieveSchedulesDetails(
      true,
      scheduleId ? 'PUT' : 'POST'
    );

    if (scheduleId) {
      const matchupsFromSchedulesDetails = schedulesDetails!.filter(v => !v.game_id);

      const schedulesDetailsToAdd = updatedSchedulesDetails!.filter(
        v =>
          v.away_team_id &&
          !v.game_id &&
          !matchupsFromSchedulesDetails.find(
            detail =>
              detail.away_team_id === v.away_team_id &&
              detail.home_team_id === v.home_team_id
          )
      );

      const schedulesDetailsToDelete = matchupsFromSchedulesDetails.filter(o =>
        gamesCells?.find(
          x =>
            x.assignedGameId &&
            x.awayTeamId === o.away_team_id &&
            x.homeTeamId === o.home_team_id
        ) ||
        !gamesCells?.find(
          y =>
            !y.assignedGameId &&
            y.awayTeamId === o.away_team_id &&
            y.homeTeamId === o.home_team_id
        )
      );

      const modifiedSchedulesDetails = updatedSchedulesDetails.filter(v => !schedulesDetailsToDelete.includes(v) && !schedulesDetailsToAdd.includes(v));

      updateSchedule(schedule, updatedSchedulesDetails);
      this.props.addSchedulesDetails(modifiedSchedulesDetails, schedulesDetailsToAdd);
      this.props.deleteSchedulesDetails(modifiedSchedulesDetails, schedulesDetailsToDelete);
    } else {
      createSchedule(schedule, updatedSchedulesDetails);
    }

    if (cancelConfirmationOpen) {
      this.onExit();
    }
  };

  unpublish = async () => {
    const { event, publishedClear, getPublishedGames } = this.props;
    const schedulesGames = await this.retrieveSchedulesGames();
    const schedule = this.getSchedule();

    if (schedule) {
      const schedulesGamesChunk = chunk(schedulesGames, 50);
      schedule.is_published_YN = ScheduleStatuses.Draft;
      const response = await api.put('/schedules', schedule);
      await Promise.all(
        schedulesGamesChunk.map(async arr => await api.delete('/games', arr))
      );
      if (response) {
        publishedClear();
      }
      getPublishedGames(event!.event_id, schedule.schedule_id);
    }
  };

  onSaveDraft = async () => {
    // looks like this method isn't used
    const { draftSaved, saveDraft, updateDraft } = this.props;
    const { scheduleId, cancelConfirmationOpen } = this.state;
    const localSchedule = this.getSchedule();

    const schedulesDetails = await this.retrieveSchedulesDetails(true, 'POST');

    if (!localSchedule || !schedulesDetails) {
      throw errorToast('Failed to save schedules data');
    }

    if (!scheduleId && !draftSaved) {
      this.updateUrlWithScheduleId();
      saveDraft(localSchedule, schedulesDetails);
    } else {
      updateDraft(schedulesDetails);
    }

    if (cancelConfirmationOpen) {
      this.closeCancelConfirmation();
      this.onExit();
    }
  };

  saveAndPublish = async () => {
    const {
      schedulesPublished,
      updatePublishedSchedulesDetails,
      publishSchedulesDetails,
    } = this.props;
    const schedulesDetails = await this.retrieveSchedulesDetails(false, 'POST');
    const schedulesGames = await this.retrieveSchedulesGames();
    const localSchedule = this.getSchedule();

    if (!schedulesDetails || !schedulesGames || !localSchedule) {
      throw errorToast('Failed to save schedules data');
    }

    if (schedulesPublished) {
      updatePublishedSchedulesDetails(schedulesDetails, schedulesGames);
      return;
    }

    this.updateUrlWithScheduleId();
    publishSchedulesDetails(localSchedule, schedulesDetails, schedulesGames);
  };

  updateUrlWithScheduleId = () => {
    const { event, history } = this.props;
    const localSchedule = this.getSchedule();
    const eventId = event?.event_id;
    const scheduleId = localSchedule?.schedule_id;
    const url = `/schedules/${eventId}/${scheduleId}`;
    history.push(url);
  };

  onScheduleCardsUpdate = (teamCards: ITeamCard[]) =>
    this.props.fillSchedulesTable(teamCards);

  onScheduleCardUpdate = (teamCard: ITeamCard) =>
    this.props.updateSchedulesTable(teamCard);

  onScheduleGameUpdate = (gameId: number, gameTime: string) => {
    // make it through redux
    const { games } = this.state;
    const foundGame = games?.find((g: IGame) => g.id === gameId);
    if (foundGame) {
      foundGame.startTime = gameTime;
    }
  };

  isVisualGamesMakerMode = () => {
    const { schedule, scheduleData } = this.props;

    return (
      (scheduleData?.create_mode &&
        ScheduleCreationType[scheduleData?.create_mode] ===
        ScheduleCreationType.Visual) ||
      (schedule?.create_mode &&
        ScheduleCreationType[schedule?.create_mode] ===
        ScheduleCreationType.Visual)
    );
  };

  toggleShowTeamsNames = () => {
    this.setState({ vgmShowTeamsNames: !this.state.vgmShowTeamsNames });
  };

  render() {
    const {
      divisions,
      event,
      eventSummary,
      schedulesTeamCards,
      schedulesHistoryLength,
      savingInProgress,
      scheduleData,
      schedule,
      pools,
      anotherSchedulePublished,
      schedulesPublished,
      isFullScreen,
      onScheduleUndo,
      onToggleFullScreen,
      updateSchedulesDetails,
      schedulesDetails,
    } = this.props;

    const {
      activeTab,
      fields,
      timeSlots,
      timeValues,
      games,
      gamesCells,
      facilities,
      isLoading,
      teamsDiagnostics,
      divisionsDiagnostics,
      cancelConfirmationOpen,
      loadingType,
      playoffTimeSlots,
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

    const scheduleName =
      scheduleData?.schedule_name || schedule?.schedule_name || '';

    return (
      <div
        className={`${styles.container} ${
          isFullScreen ? styles.containerFullScreen : ''
          }`}
      >
        {loadCondition && !isLoading && (
          <SchedulesPaper
            scheduleName={scheduleName}
            schedulePublished={schedulesPublished}
            anotherSchedulePublished={anotherSchedulePublished}
            savingInProgress={savingInProgress}
            isFullScreen={isFullScreen}
            onClose={this.onClose}
            onSaveDraft={this.save}
            onUnpublish={this.unpublish}
            saveAndPublish={this.save}
          />
        )}
        {loadCondition && !isLoading ? (
          <section className={styles.tabsContainer}>
            <div className={styles.tabToggle}>
              {this.isVisualGamesMakerMode() && (
                <div
                  className={activeTab === 1 ? styles.active : ''}
                  onClick={() => this.setState({ activeTab: 1 })}
                >
                  Visual Games Maker
                </div>
              )}
              <div
                className={activeTab === 2 ? styles.active : ''}
                onClick={() => this.setState({ activeTab: 2 })}
              >
                Schedule
              </div>
            </div>
            {activeTab === SchedulesTabsEnum.VisualGamesMaker ? (
              <VisualGamesMaker
                gamesCells={this.state.gamesCells}
                onGamesListChange={this.onGamesListChange}
                showTeamsNames={this.state.vgmShowTeamsNames}
                toggleShowTeamsNames={this.toggleShowTeamsNames}
              />
            ) : (
                <TableSchedule
                  tableType={TableScheduleTypes.SCHEDULES}
                  event={event!}
                  fields={fields!}
                  pools={pools!}
                  games={games!}
                  timeSlots={timeSlots!}
                  timeValues={timeValues!}
                  divisions={divisions!}
                  facilities={facilities!}
                  teamCards={schedulesTeamCards!}
                  eventSummary={eventSummary!}
                  scheduleData={
                    scheduleData?.schedule_name ? scheduleData : schedule!
                  }
                  schedulesDetails={schedulesDetails}
                  historyLength={schedulesHistoryLength}
                  teamsDiagnostics={teamsDiagnostics}
                  divisionsDiagnostics={divisionsDiagnostics}
                  isFullScreen={isFullScreen}
                  onScheduleGameUpdate={this.onScheduleGameUpdate}
                  onTeamCardsUpdate={this.onScheduleCardsUpdate}
                  onTeamCardUpdate={this.onScheduleCardUpdate}
                  onUndo={onScheduleUndo}
                  onToggleFullScreen={onToggleFullScreen}
                  playoffTimeSlots={playoffTimeSlots}
                  onBracketGameUpdate={() => { }}
                  recalculateDiagnostics={this.calculateDiagnostics}
                  matchups={gamesCells}
                  onAssignMatchup={this.onAssignMatchup}
                  updateSchedulesDetails={updateSchedulesDetails}
                  onGamesListChange={this.onGamesListChange}
                />
              )}
          </section>
        ) : (
            <div className={styles.loadingWrapper}>
              <SchedulesLoader type={loadingType} time={5000} />
            </div>
          )}

        <PopupExposure
          isOpen={cancelConfirmationOpen}
          onClose={this.closeCancelConfirmation}
          onExitClick={this.onExit}
          onSaveClick={this.save}
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
  gamesAlreadyExist: schedules?.gamesAlreadyExist,
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
      publishedSuccess,
      onScheduleUndo,
      fetchSchedulesDetails,
      schedulesSavingInProgress,
      clearSchedulesTable,
      getAllPools,
      //
      createSchedule,
      updateSchedule,
      schedulesDetailsClear,
      //
      updateSchedulesDetails,
      deleteSchedulesDetails,
      addSchedulesDetails,
      setIsAlreadyDraftSaveStatus,
    },
    dispatch
  );

export default connect<IMapStateToProps, IMapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Schedules);
