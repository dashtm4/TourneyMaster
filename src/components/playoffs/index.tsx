import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { History } from 'history';
import { Button, Paper, PopupExposure } from 'components/common';
import styles from './styles.module.scss';
import BracketManager from './tabs/brackets';
import ResourceMatrix from './tabs/resources';
import { fetchSchedulesDetails } from 'components/schedules/logic/actions';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import { ITournamentData } from 'common/models/tournament';
import {
  IEventSummary,
  ISchedule,
  IPool,
  ISchedulesDetails,
} from 'common/models';
import { fetchEventSummary } from 'components/schedules/logic/actions';
import {
  fillSchedulesTable,
  clearSchedulesTable,
} from 'components/schedules/logic/schedules-table/actions';
import { IBracket } from 'common/models/playoffs/bracket';
import { getTimeValuesFromEventSchedule, calculateTimeSlots } from 'helpers';
import {
  sortFieldsByPremier,
  defineGames,
  IGame,
  settleTeamsPerGamesDays,
} from 'components/common/matrix-table/helper';
import {
  mapFieldsData,
  mapTeamsData,
  mapFacilitiesData,
} from 'components/schedules/mapTournamentData';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { mapTeamsFromSchedulesDetails } from 'components/schedules/mapScheduleData';
import { ITeamCard, ITeam } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import {
  IBracketGame,
  IBracketSeed,
  getFacilityData,
  populateBracketGamesWithData,
  populatePlayoffGames,
  createSeeds,
  createBracketGames,
} from './bracketGames';
import {
  populateDefinedGamesWithPlayoffState,
  adjustPlayoffTimeOnLoad,
} from 'components/schedules/definePlayoffs';
import {
  createPlayoff,
  savePlayoff,
  retrieveBracketsGames,
  retrieveBrackets,
  clearBracketGames,
  fetchBracketGames,
} from './logic/actions';
import { updateGameBracketInfo } from './helper';
import api from 'api/api';

interface IMapStateToProps extends Partial<ITournamentData> {
  eventSummary?: IEventSummary[];
  bracket: IBracket | null;
  schedule?: ISchedule;
  pools?: IPool[];
  schedulesTeamCards?: ITeamCard[];
  schedulesDetails?: ISchedulesDetails[];
  playoffSaved?: boolean;
  bracketGames: IBracketGame[] | null;
}

interface IMapDispatchToProps {
  fetchEventSummary: (eventId: string) => void;
  fetchSchedulesDetails: (scheduleId: string) => void;
  getAllPools: (divisionIds: string[]) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  clearSchedulesTable: () => void;
  createPlayoff: (bracketGames: IBracketGame[]) => void;
  savePlayoff: (bracketGames: IBracketGame[]) => void;
  retrieveBracketsGames: (bracketId: string) => void;
  retrieveBrackets: (bracketId: string) => void;
  clearBracketGames: () => void;
  fetchBracketGames: (bracketGames: IBracketGame[]) => void;
}

interface IProps extends IMapStateToProps, IMapDispatchToProps {
  match: any;
  history: History;
}

interface IState {
  activeTab: PlayoffsTabsEnum;
  games?: IGame[];
  teams?: ITeam[];
  timeSlots?: ITimeSlot[];
  fields?: IField[];
  facilities?: IScheduleFacility[];
  bracketGames?: IBracketGame[];
  bracketSeeds?: IBracketSeed[];
  playoffTimeSlots?: ITimeSlot[];
  tableGames?: IGame[];
  cancelConfirmationOpen: boolean;
}

enum PlayoffsTabsEnum {
  ResourceMatrix = 1,
  BracketManager = 2,
}

class Playoffs extends Component<IProps> {
  state: IState = {
    activeTab: PlayoffsTabsEnum.ResourceMatrix,
    cancelConfirmationOpen: false,
  };

  async componentDidMount() {
    const { event, match } = this.props;
    const eventId = event?.event_id!;
    const { scheduleId, bracketId } = match.params;

    this.props.clearBracketGames();
    this.props.clearSchedulesTable();
    this.props.fetchEventSummary(eventId);
    this.props.fetchSchedulesDetails(scheduleId);

    if (bracketId) {
      this.retrieveBracketsData();
    } else {
      this.createBracketGames();
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const { schedulesDetails, schedulesTeamCards } = this.props;
    const { teams } = this.state;

    if (!schedulesTeamCards && schedulesDetails && teams) {
      const mappedTeams = mapTeamsFromSchedulesDetails(schedulesDetails, teams);
      this.props.fillSchedulesTable(mappedTeams);
    }

    if (!this.state.games) {
      this.calculateNeccessaryData();
    }

    if (!this.state.playoffTimeSlots) {
      this.calculatePlayoffTimeSlots();
    }

    if (!this.state.tableGames) {
      this.calculateBracketGames();
    }

    if (this.props.playoffSaved && !prevProps.playoffSaved) {
      this.updateUrlWithBracketId();
    }
  }

  updateUrlWithBracketId = () => {
    const { match, bracket } = this.props;
    const { eventId, scheduleId } = match.params;
    const bracketId = bracket?.id;
    this.props.history.push(`/playoffs/${eventId}/${scheduleId}/${bracketId}`);
  };

  calculateNeccessaryData = () => {
    const {
      event,
      schedule,
      fields,
      teams,
      divisions,
      facilities,
    } = this.props;

    if (!event || !schedule || !fields || !teams || !divisions || !facilities)
      return;

    const timeValues = getTimeValuesFromEventSchedule(event, schedule);
    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);
    const mappedTeams = mapTeamsData(teams, divisions);

    const mappedFacilities = mapFacilitiesData(facilities);

    this.setState({
      games,
      timeSlots,
      fields: sortedFields,
      teams: mappedTeams,
      facilities: mappedFacilities,
    });
  };

  createBracketGames = () => {
    const { event, divisions } = this.props;
    const bracketTeamsNum = event?.num_teams_bracket || 0;
    const bracketGames = createBracketGames(divisions!, bracketTeamsNum);
    this.props.fetchBracketGames(bracketGames);
  };

  retrieveBracketsData = () => {
    const { match } = this.props;
    const { bracketId } = match.params;
    this.props.retrieveBracketsGames(bracketId);
    this.props.retrieveBrackets(bracketId);
  };

  calculatePlayoffTimeSlots = () => {
    const { schedulesDetails, divisions, event } = this.props;
    const { timeSlots, fields } = this.state;

    const day = event?.event_enddate;

    if (
      !schedulesDetails ||
      !fields ||
      !timeSlots ||
      !divisions ||
      !event ||
      !day
    )
      return;

    const playoffTimeSlots = adjustPlayoffTimeOnLoad(
      schedulesDetails,
      fields,
      timeSlots,
      divisions,
      event,
      day
    );

    if (playoffTimeSlots) {
      this.setState({ playoffTimeSlots });
    }
  };

  calculateBracketGames = () => {
    const {
      event,
      divisions,
      schedulesTeamCards,
      fields,
      bracketGames,
    } = this.props;
    const { games, playoffTimeSlots } = this.state;
    const bracketTeamsNum = event?.num_teams_bracket || 0;
    const gameDate = moment(event?.event_enddate).toISOString();

    if (
      !divisions ||
      !games ||
      !playoffTimeSlots ||
      !schedulesTeamCards ||
      !bracketGames ||
      !fields
    )
      return;

    const definedGames = populateDefinedGamesWithPlayoffState(
      games,
      playoffTimeSlots
    );

    const facilityData = getFacilityData(schedulesTeamCards, games);
    const mergedGames = populatePlayoffGames(
      definedGames,
      bracketGames,
      divisions,
      facilityData
    );

    const tableGames = settleTeamsPerGamesDays(
      mergedGames,
      schedulesTeamCards,
      gameDate
    );

    const populatedBracketGames = populateBracketGamesWithData(
      bracketGames,
      mergedGames,
      fields,
      gameDate
    );

    const seeds = createSeeds(bracketTeamsNum);
    this.setState({
      tableGames,
      bracketGames: populatedBracketGames,
      bracketSeeds: seeds,
    });
  };

  updateMergedGames = (game: IGame, withGame?: IGame) => {
    const { tableGames, bracketGames } = this.state;

    const updatedGame = updateGameBracketInfo(game, withGame);
    const newTableGames = tableGames?.map(item =>
      item.id === game.id ? updatedGame : item
    );

    const newBracketGames = bracketGames?.map(item =>
      item.index === game.playoffIndex && item.divisionId === game.divisionId
        ? {
            ...item,
            hidden: !!withGame?.playoffIndex,
          }
        : item
    );

    this.setState({
      tableGames: newTableGames,
      bracketGames: newBracketGames,
    });
  };

  openCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: true });

  closeCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: false });

  onGoBack = () => {
    // if (condition) {
    this.openCancelConfirmation();
    // } else {
    // this.onExit();
    // }
  };

  onExit = () => {
    const { eventId } = this.props.match.params;
    this.props.history.push(`/event/scheduling/${eventId}`);
  };

  addGame = () => {};

  onSeedsUsed = () => {};

  onSavePressed = () => {
    const { match } = this.props;
    const { bracketGames, cancelConfirmationOpen } = this.state;
    const { bracketId } = match.params;

    if (bracketId) {
      this.props.savePlayoff(bracketGames!);
    } else {
      this.props.createPlayoff(bracketGames!);
    }

    if (cancelConfirmationOpen) {
      this.closeCancelConfirmation();
      this.onExit();
    }
  };

  render() {
    const {
      activeTab,
      timeSlots,
      fields,
      facilities,
      bracketGames,
      bracketSeeds,
      tableGames,
      cancelConfirmationOpen,
    } = this.state;

    const {
      bracket,
      event,
      divisions,
      pools,
      schedulesTeamCards,
      eventSummary,
      schedule,
      schedulesDetails,
    } = this.props;

    const saveButtonCondition = bracket && bracketGames;

    return (
      <div className={styles.container}>
        <DndProvider backend={HTML5Backend}>
          <div className={styles.paperWrapper}>
            <Paper>
              <div className={styles.paperContainer}>
                <div className={styles.bracketName}>
                  <span>{bracket?.name}</span>
                </div>
                <div>
                  <Button
                    label="Close"
                    variant="text"
                    color="secondary"
                    onClick={this.onGoBack}
                  />
                  <Button
                    label="Save"
                    variant="contained"
                    color="primary"
                    disabled={!saveButtonCondition}
                    onClick={this.onSavePressed}
                  />
                </div>
              </div>
            </Paper>
          </div>

          <section className={styles.tabsContainer}>
            <div className={styles.tabToggle}>
              <div
                className={activeTab === 1 ? styles.active : ''}
                onClick={() => this.setState({ activeTab: 1 })}
              >
                Resource Matrix
              </div>
              <div
                className={activeTab === 2 ? styles.active : ''}
                onClick={() => this.setState({ activeTab: 2 })}
              >
                Bracket Manager
              </div>
            </div>
            {activeTab === PlayoffsTabsEnum.ResourceMatrix ? (
              <ResourceMatrix
                bracketGames={bracketGames}
                event={event}
                divisions={divisions}
                pools={pools}
                teamCards={schedulesTeamCards}
                games={tableGames}
                fields={fields}
                timeSlots={timeSlots}
                facilities={facilities}
                scheduleData={schedule}
                eventSummary={eventSummary}
                schedulesDetails={schedulesDetails}
                onTeamCardsUpdate={() => {}}
                onTeamCardUpdate={() => {}}
                onUndo={() => {}}
                updateGame={this.updateMergedGames}
              />
            ) : (
              <BracketManager
                divisions={divisions!}
                seeds={bracketSeeds}
                bracketGames={bracketGames}
              />
            )}
          </section>
        </DndProvider>
        <PopupExposure
          isOpen={cancelConfirmationOpen}
          onClose={this.closeCancelConfirmation}
          onExitClick={this.onExit}
          onSaveClick={this.onSavePressed}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  schedules,
  scheduling,
  divisions,
  schedulesTable,
  playoffs,
}: IAppState): IMapStateToProps => ({
  event: pageEvent.tournamentData.event,
  facilities: pageEvent.tournamentData.facilities,
  divisions: pageEvent.tournamentData.divisions,
  teams: pageEvent.tournamentData.teams,
  fields: pageEvent.tournamentData.fields,
  schedules: pageEvent.tournamentData.schedules,
  eventSummary: schedules.eventSummary,
  bracket: scheduling.bracket,
  schedule: schedules.schedule,
  pools: divisions?.pools,
  schedulesTeamCards: schedulesTable.current,
  schedulesDetails: schedules?.schedulesDetails,
  playoffSaved: playoffs?.playoffSaved,
  bracketGames: playoffs?.bracketGames,
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps =>
  bindActionCreators(
    {
      fetchEventSummary,
      fetchSchedulesDetails,
      getAllPools,
      fillSchedulesTable,
      clearSchedulesTable,
      createPlayoff,
      savePlayoff,
      retrieveBracketsGames,
      retrieveBrackets,
      clearBracketGames,
      fetchBracketGames,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Playoffs);
