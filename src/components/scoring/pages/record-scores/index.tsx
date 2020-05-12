import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import History from 'browserhistory';
import { orderBy } from 'lodash-es';
import { loadScoresData, saveGames } from './logic/actions';
import Navigation from './components/navigation';
import { Loader, PopupExposure, TableSchedule } from 'components/common';
import {
  IDivision,
  ITeam,
  IEventSummary,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  IPool,
  ISchedulesGame,
  BindingCbWithOne,
  BindingAction,
  IFetchedBracket,
} from 'common/models';
import {
  retrieveBracketsGames,
  fetchBracketGames,
  savePlayoff,
  retrieveBrackets,
} from 'components/playoffs/logic/actions';
import { Routes, TableScheduleTypes } from 'common/enums';
import styles from './styles.module.scss';
import {
  mapFacilitiesData,
  mapFieldsData,
  mapTeamsData,
  mapDivisionsData,
} from 'components/schedules/mapTournamentData';
import {
  getTimeValuesFromEventSchedule,
  calculateTimeSlots,
  calculateTournamentDays,
  formatTimeSlot,
  timeSlotsEntityTypes,
} from 'helpers';
import {
  sortFieldsByPremier,
  defineGames,
  IGame,
  settleTeamsPerGamesDays,
} from 'components/common/matrix-table/helper';
import { IAppState } from 'reducers/root-reducer.types';
import {
  ITeam as IScheduleTeam,
  ITeamCard,
} from 'common/models/schedule/teams';
import {
  mapTeamsFromShedulesGames,
  mapTeamCardsToSchedulesGames,
} from 'components/schedules/mapScheduleData';
import {
  fillSchedulesTable,
  updateSchedulesTable,
  clearSchedulesTable,
} from 'components/schedules/logic/schedules-table/actions';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IField as IScheduleField } from 'common/models/schedule/fields';
import { errorToast } from 'components/common/toastr/showToasts';
import { mapGamesWithSchedulesGamesId } from 'components/scoring/helpers';
import api from 'api/api';
import { adjustPlayoffTimeOnLoadScoring } from 'components/schedules/definePlayoffs';
import { IBracketGame } from 'components/playoffs/bracketGames';
import ErrorModal from './components/error-modal';
import { advanceTeamsIntoAnotherBracket } from 'components/playoffs/helper';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  event: IEventDetails | null;
  facilities: IFacility[];
  fields: IField[];
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  schedule: ISchedule | null;
  eventSummary: IEventSummary[];
  schedulesGames: ISchedulesGame[];
  schedulesTeamCards?: ITeamCard[];
  isFullScreen: boolean;
  bracketGames: IBracketGame[] | null;
  loadScoresData: (eventId: string) => void;
  fillSchedulesTable: BindingCbWithOne<ITeamCard[]>;
  updateSchedulesTable: BindingCbWithOne<ITeamCard>;
  saveGames: BindingCbWithOne<ISchedulesGame[]>;
  onToggleFullScreen: BindingAction;
  clearSchedulesTable: () => void;
  retrieveBracketsGames: (bracketId: string) => void;
  fetchBracketGames: (
    bracketGames: IBracketGame[],
    skipHistory?: boolean
  ) => void;
  savePlayoff: (bracketGames: IBracketGame[]) => void;
  retrieveBrackets: (bracketId: string) => void;
}

interface State {
  games?: IGame[];
  timeSlots?: ITimeSlot[];
  teams?: IScheduleTeam[];
  fields?: IScheduleField[];
  facilities?: IScheduleFacility[];
  divisions?: IScheduleDivision[];
  isExposurePopupOpen: boolean;
  isEnterScores: boolean;
  neccessaryDataCalculated: boolean;
  changesAreMade: boolean;
  playoffTimeSlots?: ITimeSlot[];
  bracketId?: string;
  errorModalOpen: boolean;
  errorModalMessage?: string;
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
      neccessaryDataCalculated: false,
      changesAreMade: false,
      errorModalOpen: false,
    };
  }

  async componentDidMount() {
    const {
      loadScoresData,
      retrieveBrackets,
      retrieveBracketsGames,
    } = this.props;
    const eventId = this.props.match.params.eventId;
    this.props.clearSchedulesTable();
    const brackets: (
      | IFetchedBracket
      | undefined
    )[] = await api.get('/brackets_details', { event_id: eventId });
    const publishedBracketId = brackets.find(item => item?.is_published_YN)
      ?.bracket_id;

    if (eventId) {
      loadScoresData(eventId);

      if (publishedBracketId) {
        retrieveBrackets(publishedBracketId);
        retrieveBracketsGames(publishedBracketId);
      }
    }

    this.setState({
      bracketId: publishedBracketId,
    });
  }

  componentDidUpdate() {
    const { schedule, schedulesGames, schedulesTeamCards, event } = this.props;
    const { teams, games, neccessaryDataCalculated, timeSlots } = this.state;

    if (!neccessaryDataCalculated && schedule) {
      this.calculateNeccessaryData();
      return;
    }

    if (
      event &&
      games?.length &&
      !schedulesTeamCards &&
      schedulesGames &&
      teams &&
      schedule
    ) {
      const days = calculateTournamentDays(event);
      const lastDay = days[days.length - 1];

      const mappedGames = mapGamesWithSchedulesGamesId(games, schedulesGames);

      const playoffTimeSlots = adjustPlayoffTimeOnLoadScoring(
        schedulesGames,
        timeSlots!,
        event,
        lastDay
      );

      this.setState({ games: mappedGames, playoffTimeSlots });

      const mappedTeams = mapTeamsFromShedulesGames(
        schedulesGames,
        teams,
        mappedGames
      );

      this.props.fillSchedulesTable(mappedTeams);
    }
  }

  calculateNeccessaryData = () => {
    const {
      event,
      schedule,
      fields,
      teams,
      divisions,
      facilities,
      schedulesGames,
    } = this.props;

    if (
      !schedule ||
      !event ||
      !Boolean(fields.length) ||
      !Boolean(teams.length) ||
      !Boolean(divisions.length) ||
      !Boolean(facilities.length)
    ) {
      return;
    }

    const timeValues = getTimeValuesFromEventSchedule(event, schedule);

    const timeSlots = calculateTimeSlots(
      timeValues,
      schedulesGames,
      timeSlotsEntityTypes.SCHEDULE_GAMES
    );

    const mappedFields = mapFieldsData(fields, facilities);
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

  retrieveSchedulesGames = async () => {
    const { games } = this.state;
    const { schedulesTeamCards, schedule, event } = this.props;

    if (!schedule || !games || !schedulesTeamCards) {
      throw errorToast('Failed to retrieve schedules data');
    }

    const tournamentDays = calculateTournamentDays(event!);
    const publishedGames = await api.get('/games', {
      schedule_id: schedule.schedule_id,
    });

    let schedulesTableGames = [];
    for (const day of tournamentDays) {
      schedulesTableGames.push(
        settleTeamsPerGamesDays(games, schedulesTeamCards, day)
      );
    }
    schedulesTableGames = schedulesTableGames.flat();

    return mapTeamCardsToSchedulesGames(
      schedule,
      schedulesTableGames,
      publishedGames
    );
  };

  saveDraft = async () => {
    const { bracketGames } = this.props;
    const schedulesGames = await this.retrieveSchedulesGames();

    if (!schedulesGames) {
      throw errorToast('Failed to save schedules data');
    }

    if (bracketGames?.length) {
      const errorMessage = this.checkBracketGamesScores(bracketGames);
      if (errorMessage) {
        return this.setState({
          errorModalOpen: true,
          errorModalMessage: errorMessage,
        });
      }
      this.props.savePlayoff(bracketGames);
    }

    this.props.saveGames(schedulesGames);

    this.setState({ isExposurePopupOpen: false, changesAreMade: false });
  };

  closeErrorModal = () => {
    this.setState({
      errorModalOpen: false,
      errorModalMessage: undefined,
    });
  };

  checkBracketGamesScores = (bracketGames: IBracketGame[]) => {
    const teamBracketGames = bracketGames.filter(
      item => item.awayTeamId || item.homeTeamId
    );

    const unassignedGames = teamBracketGames.filter(
      item =>
        (item.awayTeamScore && item.homeTeamScore === undefined) ||
        (item.awayTeamScore === undefined && item.homeTeamScore)
    );

    if (!unassignedGames.length) return;

    const message = `Unaccomplished bracket games cannot be saved.\nComplete the scoring for the following games to continue:\n`;

    const sortedUnassignedGames = orderBy(
      unassignedGames,
      ['index', 'divisionName'],
      ['asc', 'asc']
    );

    const gamesStrings = sortedUnassignedGames.map(
      item =>
        `Game ${item.index} (${item.divisionName}) - ${
          item.fieldName
        }, ${formatTimeSlot(item.startTime!)}\n`
    );

    return message.concat(gamesStrings.join(''));
  };

  onChangeView = (flag: boolean) => this.setState({ isEnterScores: flag });

  leavePage = () => {
    const eventId = this.props.match.params.eventId;

    History.push(`${Routes.SCORING}/${eventId || ''}`);
  };

  saveOnExit = () => {
    this.saveDraft();
    this.leavePage();
  };

  onLeavePage = () => {
    if (this.state.changesAreMade) {
      this.setState({ isExposurePopupOpen: true });
    } else {
      this.leavePage();
    }
  };

  onClosePopup = () => this.setState({ isExposurePopupOpen: false });

  onScheduleCardUpdate = (teamCard: ITeamCard) => {
    this.props.updateSchedulesTable(teamCard);
    if (!this.state.changesAreMade) {
      this.setState({ changesAreMade: true });
    }
  };

  onBracketGameUpdate = (bracketGame: IBracketGame) => {
    const { bracketGames } = this.props;

    if (!bracketGames) return;

    const newBracketGames = advanceTeamsIntoAnotherBracket(
      bracketGame,
      bracketGames
    );

    this.props.fetchBracketGames(newBracketGames, true);
  };

  render() {
    const {
      isLoading,
      divisions,
      event,
      eventSummary,
      pools,
      schedule,
      schedulesTeamCards,
      isFullScreen,
      onToggleFullScreen,
      bracketGames,
    } = this.props;

    const {
      fields,
      timeSlots,
      games,
      facilities,
      isEnterScores,
      isExposurePopupOpen,
      playoffTimeSlots,
      errorModalOpen,
      errorModalMessage,
    } = this.state;

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      facilities?.length &&
      event &&
      Boolean(divisions.length) &&
      Boolean(pools.length) &&
      Boolean(eventSummary.length) &&
      schedulesTeamCards?.length
    );

    return (
      <div className={isFullScreen ? styles.fullScreenWrapper : ''}>
        <Navigation
          isEnterScores={isEnterScores}
          isFullScreen={isFullScreen}
          onLeavePage={this.onLeavePage}
          onChangeView={this.onChangeView}
          onSaveDraft={this.saveDraft}
        />
        <section className={styles.scoringWrapper}>
          <h2 className="visually-hidden">Scoring</h2>
          {loadCondition && !isLoading ? (
            <TableSchedule
              tableType={TableScheduleTypes.SCORES}
              event={event!}
              fields={fields!}
              games={games!}
              timeSlots={timeSlots!}
              pools={pools}
              divisions={divisions!}
              facilities={facilities!}
              teamCards={schedulesTeamCards!}
              eventSummary={eventSummary!}
              scheduleData={schedule!}
              isEnterScores={isEnterScores}
              isFullScreen={isFullScreen}
              onTeamCardsUpdate={() => {}}
              onTeamCardUpdate={this.onScheduleCardUpdate}
              onUndo={() => {}}
              onToggleFullScreen={onToggleFullScreen}
              playoffTimeSlots={playoffTimeSlots}
              bracketGames={bracketGames || undefined}
              onBracketGameUpdate={this.onBracketGameUpdate}
            />
          ) : (
            <Loader />
          )}
        </section>
        <PopupExposure
          isOpen={isExposurePopupOpen}
          onClose={this.onClosePopup}
          onExitClick={this.leavePage}
          onSaveClick={this.saveOnExit}
        />
        <ErrorModal
          title="Warning"
          isOpen={errorModalOpen}
          message={errorModalMessage || ''}
          onClose={this.closeErrorModal}
        />
      </div>
    );
  }
}

export default connect(
  ({ recordScores, schedulesTable, playoffs }: IAppState) => ({
    isLoading: recordScores.isLoading,
    isLoaded: recordScores.isLoaded,
    event: recordScores.event,
    facilities: recordScores.facilities,
    fields: recordScores.fields,
    divisions: recordScores.divisions,
    pools: recordScores.pools,
    teams: recordScores.teams,
    schedule: recordScores.schedule,
    eventSummary: recordScores.eventSummary,
    schedulesTeamCards: schedulesTable?.current,
    schedulesGames: recordScores.schedulesGames,
    bracketGames: playoffs?.bracketGames,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadScoresData,
        fillSchedulesTable,
        updateSchedulesTable,
        saveGames,
        clearSchedulesTable,
        retrieveBracketsGames,
        fetchBracketGames,
        savePlayoff,
        retrieveBrackets,
      },
      dispatch
    )
)(RecordScores);
