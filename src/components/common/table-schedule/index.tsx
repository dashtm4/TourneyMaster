import React from 'react';
import ListUnassigned from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import TableActions from './components/table-actions';
import { MatrixTable } from 'components/common';
import { IDivision, ITeam, IEventSummary } from 'common/models';
import { getUnassignedTeams } from './helpers';
import {
  DayTypes,
  DefaulSelectFalues,
  IScheduleFilter,
  OptimizeTypes,
} from './types';
import styles from './styles.module.scss';

import {
  mockedFields,
  mockedGames,
  mockedTimeSlots,
  mockedTeamCards,
} from './mocks';

const SCHEDULE_FILTER_FALUES = {
  selectedDay: DayTypes.DAY_ONE,
  selectedDivision: DefaulSelectFalues.ALL,
  selectedTeam: DefaulSelectFalues.ALL,
  selectedField: DefaulSelectFalues.ALL,
};

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
}

const TableSchedule = ({
  divisions,
  teams,
  eventSummary,
  isEnterScores,
}: Props) => {
  const [filterValues, onFilterValueChange] = React.useState<IScheduleFilter>(
    SCHEDULE_FILTER_FALUES
  );
  const [optimizeBy, onOptimizeClick] = React.useState<OptimizeTypes>(
    OptimizeTypes.MIN_RANK
  );
  const [isHeatmap, onHeatmapChange] = React.useState<boolean>(false);

  //! dell
  const unassignedTeams = getUnassignedTeams(mockedTeamCards);

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
            teams={teams}
            eventSummary={eventSummary}
            filterValues={filterValues}
            onChangeFilterValue={onFilterValueChange}
          />
          <MatrixTable
            games={mockedGames}
            fields={mockedFields}
            timeSlots={mockedTimeSlots}
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
