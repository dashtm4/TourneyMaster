import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
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
import { bindActionCreators } from 'redux';
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
import { bracketGames, IBracketGame } from './bracketGames';

interface IMapStateToProps extends Partial<ITournamentData> {
  eventSummary?: IEventSummary[];
  bracket: IBracket | null;
  schedule?: ISchedule;
  pools?: IPool[];
  schedulesTeamCards?: ITeamCard[];
  schedulesDetails?: ISchedulesDetails[];
}

interface IMapDispatchToProps {
  fetchEventSummary: (eventId: string) => void;
  fetchSchedulesDetails: (scheduleId: string) => void;
  getAllPools: (divisionIds: string[]) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  clearSchedulesTable: () => void;
}

interface IProps extends IMapStateToProps, IMapDispatchToProps {
  match: any;
}

interface IState {
  activeTab: PlayoffsTabsEnum;
  games?: IGame[];
  teams?: ITeam[];
  timeSlots?: ITimeSlot[];
  fields?: IField[];
  facilities?: IScheduleFacility[];
  bracketGames?: IBracketGame[];
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
    this.createBracketGames();
  }

  componentDidUpdate() {
    const { schedulesDetails, schedulesTeamCards } = this.props;
    const { teams } = this.state;

    if (!schedulesTeamCards && schedulesDetails && teams) {
      const mappedTeams = mapTeamsFromSchedulesDetails(schedulesDetails, teams);
      this.props.fillSchedulesTable(mappedTeams);
    }

    if (!this.state.games) {
      this.calculateNeccessaryData();
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
    const bracketTeamsNum = event?.num_teams_bracket;

    if (!divisions) return;

    const games = bracketGames(divisions, bracketTeamsNum || 0);
    this.setState({
      bracketGames: games,
    });
  };

  addGame = () => {
    // this.setState(({ seeds }) => ({
    //   seeds: [
    //     ...(seeds || []),
    //     {
    //       id: (seeds?.length || 0) + 1,
    //       name: `Seed ${(seeds?.length || 0) + 1}`,
    //     },
    //   ],
    // }));
  };

  onSeedsUsed = () => {
    // this.setState(({ seeds }) => ({
    //   seeds: [
    //     ...seeds?.map(item => ({ ...item, hidden: seedIds.includes(item.id) })),
    //   ],
    // }));
  };

  render() {
    const {
      activeTab,
      games,
      timeSlots,
      fields,
      facilities,
      bracketGames,
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

    return (
      <div className={styles.container}>
        <div className={styles.paperWrapper}>
          <Paper>
            <div className={styles.paperContainer}>
              <div className={styles.bracketName}>
                <span>{bracket?.name}</span>
              </div>
              <div>
                <Button label="Close" variant="text" color="secondary" />
                <Button label="Save" variant="contained" color="primary" />
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
              games={games}
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
            <BracketManager />
          )}
        </section>
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
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps =>
  bindActionCreators(
    {
      fetchEventSummary,
      fetchSchedulesDetails,
      getAllPools,
      fillSchedulesTable,
      clearSchedulesTable,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Playoffs);
