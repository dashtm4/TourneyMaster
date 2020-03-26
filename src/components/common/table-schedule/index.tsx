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
  IConfigurableSchedule,
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
  handleFilterData,
  mapUnusedFields,
} from './helpers';

import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';
import moveTeamCard from './moveTeamCard';
import { Button } from 'components/common';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';

interface Props {
  event: IEventDetails;
  divisions: IDivision[];
  teamCards: ITeamCard[];
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  scheduleData: IConfigurableSchedule;
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
  historyLength?: number;
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
}

const TableSchedule = ({
  event,
  divisions,
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
    applyFilters(divisions, teamCards, eventSummary)
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

  const { filteredTeams } = mapFilterValues(teamCards, filterValues);
  const updatedFields = mapUnusedFields(fields, filteredGames);

  const unassignedTeams = getUnassignedTeams(teamCards, minGamesNum);

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
        <div className={styles.topBtnsWrapper}>
          <Button
            label={`Mode: ${zoomingDisabled ? 'Drag-n-Drop' : 'Zoom-n-Nav'}`}
            variant="text"
            color="secondary"
            icon={getIcon(zoomingDisabled ? Icons.FLIP : Icons.ZOOM)}
            onClick={toggleZooming}
          />
        </div>
        <DndProvider backend={HTML5Backend}>
          <ListUnassigned
            teamCards={unassignedTeams}
            showHeatmap={showHeatmap}
            onDrop={moveCard}
          />
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
      <PopupConfirm
        isOpen={!!replacementWarning}
        message={replacementWarning || ''}
        onClose={toggleReplacementWarning}
        onCanceClick={toggleReplacementWarning}
        onYesClick={confirmReplacement}
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
    </section>
  );
};

export default TableSchedule;
