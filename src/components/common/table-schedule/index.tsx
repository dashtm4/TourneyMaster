import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ListUnassigned from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import TableActions from './components/table-actions';
import PopupSaveReporting from './components/popup-save-reporting';
import { MatrixTable } from 'components/common';
import {
  IDivision,
  IEventSummary,
  IEventDetails,
  ISchedule,
  IPool,
} from 'common/models';
import { IScheduleFilter, OptimizeTypes } from './types';
import { mapGamesByField } from './helpers';
import { IGame, settleTeamsPerGames } from '../matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import PopupConfirm from 'components/common/popup-confirm';
import styles from './styles.module.scss';

import {
  getUnassignedTeams,
  mapGamesByFilter,
  mapFilterValues,
  applyFilters,
  mapUnusedFields,
} from './helpers';

import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';
import moveTeamCard from './moveTeamCard';
import { Button } from 'components/common';
import { TableScheduleTypes } from 'common/enums';

interface Props {
  tableType: TableScheduleTypes;
  event: IEventDetails;
  divisions: IDivision[];
  pools: IPool[];
  teamCards: ITeamCard[];
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  scheduleData: ISchedule;
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
  historyLength?: number;
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
}

const TableSchedule = ({
  tableType,
  event,
  divisions,
  pools,
  teamCards,
  games,
  fields,
  facilities,
  scheduleData,
  timeSlots,
  eventSummary,
  isEnterScores,
  onTeamCardsUpdate,
  onTeamCardUpdate,
  onUndo,
  historyLength,
}: Props) => {
  const minGamesNum = event.min_num_of_games;

  const [filterValues, changeFilterValues] = useState<IScheduleFilter>(
    applyFilters({ divisions, pools, teamCards, eventSummary })
  );

  const [optimizeBy, onOptimizeClick] = useState<OptimizeTypes>(
    OptimizeTypes.MIN_RANK
  );

  const [zoomingDisabled, changeZoomingAction] = useState(false);

  const [showHeatmap, onHeatmapChange] = useState(true);

  const [replacementTeamCards, replacementTeamCardsChange] = useState<
    ITeamCard[] | undefined
  >();
  const [replacementWarning, onReplacementWarningChange] = useState<
    string | undefined
  >();

  const filledGames = settleTeamsPerGames(games, teamCards);
  const filteredGames = mapGamesByFilter([...filledGames], filterValues);

  const updatedFields = mapUnusedFields(fields, filteredGames);

  const unassignedTeams = getUnassignedTeams(teamCards, minGamesNum);

  const updatedFilterValues = mapFilterValues(
    { teamCards, pools },
    filterValues
  );

  const onFilterChange = (data: IScheduleFilter) => {
    changeFilterValues(data);
  };

  const toggleZooming = () => changeZoomingAction(!zoomingDisabled);

  const moveCard = (dropParams: IDropParams) => {
    const result = moveTeamCard(teamCards, dropParams);
    if (result.divisionUnmatch) {
      onReplacementWarningChange(
        'The divisions of the teams do not match. Are you sure you want to continue?'
      );
      replacementTeamCardsChange(result.teamCards);
    } else if (result.poolUnmatch) {
      onReplacementWarningChange(
        'The pools of the teams do not match. Are you sure you want to continue?'
      );
      replacementTeamCardsChange(result.teamCards);
    } else {
      onTeamCardsUpdate(result.teamCards);
    }
  };

  const toggleReplacementWarning = () => onReplacementWarningChange(undefined);

  const confirmReplacement = () => {
    if (replacementTeamCards) {
      onTeamCardsUpdate(replacementTeamCards);
      toggleReplacementWarning();
    }
  };

  const onLockAll = () => {
    const lockedTeams = teamCards.map(team => ({
      ...team,
      games: team!.games?.map(game => ({ ...game, isTeamLocked: true })),
    }));
    onTeamCardsUpdate(lockedTeams);
  };

  const onUnlockAll = () => {
    const unLockedTeams = teamCards.map(team => ({
      ...team,
      games: team!.games?.map(game => ({ ...game, isTeamLocked: false })),
    }));
    onTeamCardsUpdate(unLockedTeams);
  };
  const [isPopupSaveReportOpen, onPopupSaveReport] = useState<boolean>(false);

  const togglePopupSaveReport = () => onPopupSaveReport(!isPopupSaveReportOpen);

  return (
    <section className={styles.section}>
      <h2 className="visually-hidden">Schedule table</h2>
      <div className={styles.scheduleTableWrapper}>
        {tableType === TableScheduleTypes.SCHEDULES && (
          <div className={styles.topBtnsWrapper}>
            <h3>Mode:</h3>
            <Button
              label="Zoom-n-Nav"
              variant="contained"
              color="primary"
              type={zoomingDisabled ? 'squaredOutlined' : 'squared'}
              onClick={toggleZooming}
            />
            <Button
              label="Drag-n-Drop"
              variant="contained"
              color="primary"
              type={zoomingDisabled ? 'squared' : 'squaredOutlined'}
              onClick={toggleZooming}
            />
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
          {tableType === TableScheduleTypes.SCHEDULES && (
            <ListUnassigned
              tableType={tableType}
              teamCards={unassignedTeams}
              showHeatmap={showHeatmap}
              onDrop={moveCard}
            />
          )}
          <div className={styles.tableWrapper}>
            <Filter
              filterValues={updatedFilterValues}
              onChangeFilterValue={onFilterChange}
            />
            <MatrixTable
              tableType={tableType}
              games={filteredGames}
              fields={updatedFields}
              timeSlots={timeSlots}
              facilities={facilities}
              showHeatmap={showHeatmap}
              isEnterScores={isEnterScores}
              moveCard={moveCard}
              disableZooming={zoomingDisabled}
              onTeamCardUpdate={onTeamCardUpdate}
              onTeamCardsUpdate={onTeamCardsUpdate}
              teamCards={teamCards}
            />
          </div>
        </DndProvider>
      </div>
      <DivisionHeatmap
        divisions={divisions}
        showHeatmap={showHeatmap}
        onHeatmapChange={onHeatmapChange}
      />
      <>
        {tableType === TableScheduleTypes.SCHEDULES && (
          <>
            <TableActions
              historyLength={historyLength}
              zoomingDisabled={zoomingDisabled}
              toggleZooming={toggleZooming}
              optimizeBy={optimizeBy}
              onUndoClick={onUndo}
              onLockAllClick={onLockAll}
              onUnlockAllClick={onUnlockAll}
              onOptimizeClick={onOptimizeClick}
              togglePopupSaveReport={togglePopupSaveReport}
            />
            <PopupSaveReporting
              event={event}
              games={mapGamesByField(filteredGames, updatedFields)}
              fields={updatedFields}
              timeSlots={timeSlots}
              facilities={facilities}
              schedule={scheduleData}
              isOpen={isPopupSaveReportOpen}
              onClose={togglePopupSaveReport}
            />
          </>
        )}
        <PopupConfirm
          isOpen={!!replacementWarning}
          message={replacementWarning || ''}
          onClose={toggleReplacementWarning}
          onCanceClick={toggleReplacementWarning}
          onYesClick={confirmReplacement}
        />
      </>
    </section>
  );
};

export default TableSchedule;
