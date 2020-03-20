import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ListUnassigned from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import TableActions from './components/table-actions';
import { MatrixTable, Button } from 'components/common';
import { getIcon } from 'helpers';
import { IDivision, ITeam, IEventSummary, IEventDetails } from 'common/models';
import { ButtonColors, ButtonVarian, Icons } from 'common/enums';
import { getUnassignedTeams } from './helpers';
import {
  DayTypes,
  DefaulSelectFalues,
  IScheduleFilter,
  OptimizeTypes,
} from './types';
import { IGame } from '../matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import styles from './styles.module.scss';

import PDFScheduleTable from 'pdg-layouts/schedule-table';

import {
  // mockedFields,
  // mockedGames,
  // mockedTimeSlots,
  mockedTeamCards,
} from './mocks';
import { IScheduleFacility } from 'common/models/schedule/facilities';

const SCHEDULE_FILTER_FALUES = {
  selectedDay: DayTypes.DAY_ONE,
  selectedDivision: DefaulSelectFalues.ALL,
  selectedTeam: DefaulSelectFalues.ALL,
  selectedField: DefaulSelectFalues.ALL,
};

interface Props {
  event: IEventDetails;
  divisions: IDivision[];
  teams: ITeam[];
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
}

const TableSchedule = ({
  event,
  divisions,
  teams,
  games,
  fields,
  facilities,
  timeSlots,
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

  // teams state

  // get unassigned

  // get teams for games

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
            games={games}
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
      <div className={styles.btnsWrapper}>
        <PDFDownloadLink
          document={
            <PDFScheduleTable
              event={event}
              games={games}
              fields={fields}
              timeSlots={timeSlots}
              facilities={facilities}
            />
          }
          fileName="Schedule.pdf"
        >
          <Button
            icon={getIcon(Icons.PRINT)}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Print"
          />
        </PDFDownloadLink>
      </div>
      <p>
        <PDFViewer width="500" height="400">
          <PDFScheduleTable
            event={event}
            games={games}
            fields={fields}
            timeSlots={timeSlots}
            facilities={facilities}
          />
        </PDFViewer>
      </p>
    </section>
  );
};

export default TableSchedule;
