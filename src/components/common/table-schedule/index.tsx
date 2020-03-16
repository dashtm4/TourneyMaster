import React from 'react';
import ListUnassigned from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import { MatrixTable } from 'components/common';
import { IDivision, ITeam, IEventSummary } from 'common/models';
import { getUnassignedTeams } from './helpers';
import { DayTypes, DefaulSelectFalues, IScheduleFilter } from './types';
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
}

const TableSchedule = ({ divisions, teams, eventSummary }: Props) => {
  const [filterValues, onFilterValueChange] = React.useState<IScheduleFilter>(
    SCHEDULE_FILTER_FALUES
  );
  const [isHeatmap, onHeatmapChange] = React.useState<boolean>(false);
  const unassignedTeams = getUnassignedTeams(mockedTeamCards);

  return (
    <section>
      <h2 className="visually-hidden">Schedule table</h2>
      <div className={styles.scheduleTableWrapper}>
        <ListUnassigned teams={unassignedTeams} />
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
          />
        </div>
      </div>
      <DivisionHeatmap
        divisions={divisions}
        isHeatmap={isHeatmap}
        onHeatmapChange={onHeatmapChange}
      />
    </section>
  );
};

export default TableSchedule;
