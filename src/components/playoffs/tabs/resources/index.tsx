import React, { Component } from 'react';
import styles from './styles.module.scss';
import HTML5Backend from 'react-dnd-html5-backend';
import { MatrixTable, Loader } from 'components/common';
import {
  IEventDetails,
  IDivision,
  IPool,
  IEventSummary,
  ISchedule,
  ISchedulesDetails,
} from 'common/models';
import { IField } from 'common/models/schedule/fields';
import { ITeamCard } from 'common/models/schedule/teams';
import {
  IGame,
  settleTeamsPerGamesDays,
} from 'components/common/matrix-table/helper';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { TableScheduleTypes } from 'common/enums';
import { DndProvider } from 'react-dnd';
import {
  populateDefinedGamesWithPlayoffState,
  adjustPlayoffTimeOnLoad,
} from 'components/schedules/definePlayoffs';

interface IProps {
  event?: IEventDetails | null;
  divisions?: IDivision[];
  pools?: IPool[];
  teamCards?: ITeamCard[];
  games?: IGame[];
  fields?: IField[];
  timeSlots?: ITimeSlot[];
  scheduleData?: ISchedule;
  facilities?: IScheduleFacility[];
  eventSummary?: IEventSummary[];
  schedulesDetails?: ISchedulesDetails[];
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
}

interface IState {
  tableGames?: IGame[];
  playoffTimeSlots?: ITimeSlot[];
}

class ResourceMatrix extends Component<IProps> {
  state: IState = {};

  componentDidMount() {
    this.calculatePlayoffTimeSlots();
    this.loadingTableData();
  }

  componentDidUpdate() {
    const { tableGames } = this.state;

    if (!tableGames) {
      this.calculatePlayoffTimeSlots();
      this.loadingTableData();
    }
  }

  calculatePlayoffTimeSlots = () => {
    const {
      schedulesDetails,
      fields,
      timeSlots,
      divisions,
      event,
    } = this.props;

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

    this.setState({ playoffTimeSlots });
  };

  loadingTableData = () => {
    const { teamCards, games, event } = this.props;
    const { playoffTimeSlots } = this.state;
    const lastDay = event?.event_enddate;

    if (games && teamCards && lastDay && playoffTimeSlots) {
      const definedGames = populateDefinedGamesWithPlayoffState(
        games,
        playoffTimeSlots
      );

      const tableGames = settleTeamsPerGamesDays(
        definedGames,
        teamCards,
        lastDay
      );
      this.setState({
        tableGames,
      });
    }
  };

  render() {
    const {
      event,
      divisions,
      pools,
      teamCards,
      fields,
      timeSlots,
      facilities,
      scheduleData,
      eventSummary,
      onTeamCardsUpdate,
      onTeamCardUpdate,
      onUndo,
    } = this.props;

    const { tableGames } = this.state;

    return (
      <section className={styles.container}>
        <div className={styles.leftColumn}></div>
        <div className={styles.rightColumn}>
          {event &&
          divisions &&
          pools &&
          teamCards &&
          tableGames &&
          fields &&
          timeSlots &&
          facilities &&
          eventSummary &&
          onTeamCardsUpdate &&
          scheduleData &&
          onTeamCardUpdate &&
          onUndo ? (
            <DndProvider backend={HTML5Backend}>
              <MatrixTable
                tableType={TableScheduleTypes.BRACKETS}
                games={tableGames}
                fields={fields}
                timeSlots={timeSlots}
                facilities={facilities}
                showHeatmap={true}
                isEnterScores={false}
                moveCard={() => {}}
                disableZooming={false}
                onTeamCardUpdate={onTeamCardUpdate}
                onTeamCardsUpdate={onTeamCardsUpdate}
                teamCards={teamCards}
                isFullScreen={false}
                onToggleFullScreen={() => {}}
              />
            </DndProvider>
          ) : (
            <Loader styles={{ height: '100%' }} />
          )}
        </div>
      </section>
    );
  }
}

export default ResourceMatrix;
