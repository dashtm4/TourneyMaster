import React from 'react';
import ListUnassigned from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import TableActions from './components/table-actions';
import { MatrixTable } from 'components/common';
import { IDivision, IEventSummary } from 'common/models';
import {
  getUnassignedTeams,
  mapGamesByFilter,
  mapFilterValues,
  applyFilters,
  handleFilterData,
} from './helpers';
import { IScheduleFilter, OptimizeTypes } from './types';
import styles from './styles.module.scss';
import { IGame, settleTeamsPerGames } from '../matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { mockedTeamCards } from './mocks';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';

interface Props {
  divisions: IDivision[];
  teamCards: ITeamCard[];
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
}

const TableSchedule = ({
  divisions,
  teamCards: propsTeamCards,
  games,
  fields,
  facilities,
  timeSlots,
  eventSummary,
  isEnterScores,
}: Props) => {
  const [teamCards] = React.useState(propsTeamCards);

  const [filterValues, changeFilterValues] = React.useState<IScheduleFilter>(
    applyFilters(divisions, teamCards, eventSummary)
  );

  const [optimizeBy, onOptimizeClick] = React.useState<OptimizeTypes>(
    OptimizeTypes.MIN_RANK
  );

  const [isHeatmap, onHeatmapChange] = React.useState<boolean>(false);

  const filledGames = settleTeamsPerGames(games, teamCards);
  const filteredGames = mapGamesByFilter([...filledGames], filterValues);

  const { filteredTeams } = mapFilterValues(teamCards, filterValues);

  const unassignedTeams = getUnassignedTeams(mockedTeamCards);

  const onFilterChange = (data: IScheduleFilter) => {
    const filterData = handleFilterData(
      filterValues,
      data,
      divisions,
      teamCards,
      eventSummary
    );
    changeFilterValues(filterData);
  };

  return (
    <section className={styles.section}>
      <h2 className="visually-hidden">Schedule table</h2>
      <div className={styles.scheduleTableWrapper}>
        {unassignedTeams.length > 0 && (
          <ListUnassigned teams={unassignedTeams} />
        )}
        <div className={styles.tableWrapper}>
          <Filter
            divisions={divisions}
            teams={filteredTeams}
            eventSummary={eventSummary}
            filterValues={filterValues}
            onChangeFilterValue={onFilterChange}
          />
          <MatrixTable
            games={filteredGames}
            fields={fields}
            timeSlots={timeSlots}
            facilities={facilities}
            isHeatmap={isHeatmap}
            isEnterScores={isEnterScores}
          />
        </div>
      </div>
      <DivisionHeatmap
        divisions={divisions}
        isHeatmap={isHeatmap}
        onHeatmapChange={onHeatmapChange}
      />
      {unassignedTeams.length > 0 && (
        <TableActions
          optimizeBy={optimizeBy}
          onUndoClick={() => {}}
          onLockAllClick={() => {}}
          onUnlockAllClick={() => {}}
          onOptimizeClick={onOptimizeClick}
        />
      )}
    </section>
  );
};

export default TableSchedule;
