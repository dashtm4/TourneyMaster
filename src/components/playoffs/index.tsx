import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { History } from 'history';
import { Button, Paper } from 'components/common';
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
  createBracketGames,
  getFacilityData,
  populateBracketGamesWithData,
  populatePlayoffGames,
  createSeeds,
} from './bracketGames';
import {
  populateDefinedGamesWithPlayoffState,
  adjustPlayoffTimeOnLoad,
} from 'components/schedules/definePlayoffs';
import { createPlayoff, savePlayoff } from './logic/actions';

interface IMapStateToProps extends Partial<ITournamentData> {
  eventSummary?: IEventSummary[];
  bracket: IBracket | null;
  schedule?: ISchedule;
  pools?: IPool[];
  schedulesTeamCards?: ITeamCard[];
  schedulesDetails?: ISchedulesDetails[];
  playoffSaved?: boolean;
}

interface IMapDispatchToProps {
  fetchEventSummary: (eventId: string) => void;
  fetchSchedulesDetails: (scheduleId: string) => void;
  getAllPools: (divisionIds: string[]) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  clearSchedulesTable: () => void;
  createPlayoff: (bracketGames: IBracketGame[]) => void;
  savePlayoff: (bracketGames: IBracketGame[]) => void;
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
  mergedGames?: IGame[];
}

enum PlayoffsTabsEnum {
  ResourceMatrix = 1,
  BracketManager = 2,
}

class Playoffs extends Component<IProps> {
  state: IState = {
    activeTab: PlayoffsTabsEnum.ResourceMatrix,
  };

  componentDidMount() {
    const { event, match } = this.props;
    const eventId = event?.event_id!;
    const { scheduleId } = match.params;

    this.props.clearSchedulesTable();
    this.props.fetchEventSummary(eventId);
    this.props.fetchSchedulesDetails(scheduleId);
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

    if (!this.state.mergedGames) {
      this.createBracketGames();
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

  createBracketGames = () => {
    const { event, divisions, schedulesTeamCards, fields } = this.props;
    const { games, playoffTimeSlots } = this.state;
    const bracketTeamsNum = event?.num_teams_bracket || 0;
    const gameDate = moment(event?.event_enddate).toISOString();

    if (
      !divisions ||
      !games ||
      !playoffTimeSlots ||
      !schedulesTeamCards ||
      !fields
    )
      return;

    const bracketGames = createBracketGames(divisions, bracketTeamsNum);

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

    const populatedBracketGames = populateBracketGamesWithData(
      bracketGames,
      mergedGames,
      fields,
      gameDate
    );

    const seeds = createSeeds(bracketTeamsNum);
    this.setState({
      mergedGames,
      bracketGames: populatedBracketGames,
      bracketSeeds: seeds,
    });
  };

  addGame = () => {};

  onSeedsUsed = () => {};

  onSavePressed = () => {
    const { bracketGames } = this.state;
    const { match } = this.props;
    const { bracketId } = match.params;
    if (bracketId) {
      this.props.savePlayoff(bracketGames!);
    } else {
      this.props.createPlayoff(bracketGames!);
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
      mergedGames,
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
                  <Button label="Close" variant="text" color="secondary" />
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
                games={mergedGames}
                fields={fields}
                timeSlots={timeSlots}
                facilities={facilities}
                scheduleData={schedule}
                eventSummary={eventSummary}
                schedulesDetails={schedulesDetails}
                onTeamCardsUpdate={() => {}}
                onTeamCardUpdate={() => {}}
                onUndo={() => {}}
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Playoffs);
