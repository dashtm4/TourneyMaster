import React, { Component } from 'react';
import styles from './styles.module.scss';
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
import { IBracketGame } from 'components/playoffs/bracketGames';

interface IProps {
  bracketGames?: IBracketGame[];
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
}

class ResourceMatrix extends Component<IProps> {
  state: IState = {};

  componentDidMount() {
    this.loadingTableData();
  }

  componentDidUpdate() {
    const { tableGames } = this.state;

    if (!tableGames) {
      this.loadingTableData();
    }
  }

  loadingTableData = () => {
    const { teamCards, games, event, bracketGames, divisions } = this.props;
    const lastDay = event?.event_enddate;

    if (games && teamCards && lastDay && bracketGames && divisions) {
      const tableGames = settleTeamsPerGamesDays(games, teamCards, lastDay);
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
          ) : (
            <Loader styles={{ height: '100%' }} />
          )}
        </div>
      </section>
    );
  }
}

export default ResourceMatrix;
