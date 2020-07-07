/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { find } from 'lodash-es';
import {
  getAllTeamCardGames,
  calculateTournamentDays,
  getTimeSlotsFromEntities,
  ITimeValues,
} from 'helpers';
import { TableScheduleTypes, TimeSlotsEntityTypes } from 'common/enums';
import {
  IDivision,
  IEventSummary,
  IEventDetails,
  ISchedule,
  IPool,
  BindingAction,
  IConfigurableSchedule,
  ScheduleCreationType,
  ISchedulesDetails,
} from 'common/models';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard, ITeam } from 'common/models/schedule/teams';
import { Button } from 'components/common';
import PopupConfirm from 'components/common/popup-confirm';
import { MatrixTable, CardMessage } from 'components/common';
import ListUnassignedTeams from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import TableActions from './components/table-actions';
import PopupSaveReporting from './components/popup-save-reporting';
import TeamsDiagnostics from 'components/schedules/diagnostics/teamsDiagnostics';
import DivisionsDiagnostics from 'components/schedules/diagnostics/divisionsDiagnostics';
import { IDiagnosticsInput } from 'components/schedules/diagnostics';
import { populateDefinedGamesWithPlayoffState } from 'components/schedules/definePlayoffs';
import { IBracketGame } from 'components/playoffs/bracketGames';
import { updateGameSlot } from 'components/playoffs/helper';
import ListUnassignedMatchups from './components/list-unassigned-games';
import PopupAdvancedWorkflow from './components/popup-advanced-workflow';
import {
  mapGamesByFilter,
  mapFilterValues,
  applyFilters,
  mapUnusedFields,
  moveCardMessages,
  getScheduleWarning,
} from './helpers';
import { IScheduleFilter, OptimizeTypes } from './types';
import {
  IGame,
  settleTeamsPerGames,
  calculateDays,
} from '../matrix-table/helper';
import { IDropParams } from '../matrix-table/dnd/drop';
import moveTeamCard from './moveTeamCard';
import { CardMessageTypes } from '../card-message/types';
import styles from './styles.module.scss';
import { IMatchup } from 'components/visual-games-maker/helpers';

interface Props {
  tableType: TableScheduleTypes;
  event: IEventDetails;
  divisions: IDivision[];
  pools: IPool[];
  teamCards: ITeamCard[];
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  timeValues: ITimeValues;
  facilities: IScheduleFacility[];
  scheduleData: ISchedule;
  schedulesDetails?: ISchedulesDetails[];
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
  historyLength?: number;
  teamsDiagnostics?: IDiagnosticsInput;
  divisionsDiagnostics?: IDiagnosticsInput;
  isFullScreen?: boolean;
  onScheduleGameUpdate: (gameId: number, gameTime: string) => void;
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
  onToggleFullScreen?: BindingAction;
  playoffTimeSlots?: ITimeSlot[];
  bracketGames?: IBracketGame[];
  onBracketGameUpdate: (bracketGame: IBracketGame) => void;
  recalculateDiagnostics?: () => void;
  matchups: IMatchup[];
  onAssignMatchup: (id: string, assignedGameId: number | null) => void;
  updateSchedulesDetails?: (
    modifiedSchedulesDetails: ISchedulesDetails[],
    schedulesDetailsToModify: ISchedulesDetails[]
  ) => void;
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
  schedulesDetails,
  timeSlots,
  timeValues,
  eventSummary,
  isEnterScores,
  onScheduleGameUpdate,
  onTeamCardsUpdate,
  onTeamCardUpdate,
  onUndo,
  historyLength,
  teamsDiagnostics,
  divisionsDiagnostics,
  isFullScreen,
  onToggleFullScreen,
  playoffTimeSlots,
  bracketGames,
  onBracketGameUpdate,
  recalculateDiagnostics,
  matchups,
  onAssignMatchup,
  updateSchedulesDetails,
}: Props) => {
  const minGamesNum =
    Number(scheduleData?.min_num_games) || event.min_num_of_games;

  const [isFromMaker] = useState(
    (scheduleData as IConfigurableSchedule)?.create_mode ===
    ScheduleCreationType[ScheduleCreationType.Visual]
  );
  const [simultaneousDnd, setSimultaneousDnd] = useState(isFromMaker);

  const [filterValues, changeFilterValues] = useState<IScheduleFilter>(
    applyFilters({ divisions, pools, teamCards, eventSummary })
  );

  const [optimizeBy, onOptimizeClick] = useState<OptimizeTypes>(
    OptimizeTypes.MIN_RANK
  );

  const [zoomingDisabled, changeZoomingAction] = useState(false);

  const [showHeatmap, onHeatmapChange] = useState(true);

  interface IMoveCardResult {
    gameId?: number;
    teamCards: ITeamCard[];
    possibleGame?: IMatchup;
  }
  const [moveCardResult, setMoveCardResult] = useState<IMoveCardResult>();
  const [moveCardWarning, setMoveCardWarning] = useState<string | undefined>();
  const [days, setDays] = useState(calculateDays(teamCards));

  const toggleSimultaneousDnd = () => setSimultaneousDnd(v => !v);

  const manageGamesData = useCallback(() => {
    let definedGames = [...games];
    const day = filterValues.selectedDay!;

    if (+day === days.length && playoffTimeSlots) {
      definedGames = populateDefinedGamesWithPlayoffState(
        games,
        playoffTimeSlots
      );

      definedGames = definedGames.map(item => {
        const foundBracketGame = find(bracketGames, {
          fieldId: item.fieldId,
          startTime: item.startTime,
        });

        return foundBracketGame
          ? updateGameSlot(item, foundBracketGame, divisions)
          : item;
      });
    }

    const filledGames = settleTeamsPerGames(
      definedGames,
      teamCards,
      days,
      filterValues.selectedDay!
    );

    const filteredGames = mapGamesByFilter([...filledGames], filterValues);
    return filteredGames;
  }, [games, teamCards, days, filterValues, playoffTimeSlots, bracketGames]);

  const [tableGames, setTableGames] = useState<IGame[]>(manageGamesData());

  useEffect(() => {
    const newDays = calculateTournamentDays(event);
    setDays(newDays);
  }, [event]);

  useEffect(() => setTableGames(manageGamesData()), [manageGamesData]);

  const managePossibleGames = useCallback(() => {
    return matchups.map(v => {
      const homeTeam = teamCards.find(t => t.id === v.homeTeamId);
      const awayTeam = teamCards.find(t => t.id === v.awayTeamId);

      return {
        ...v,
        homeTeam,
        awayTeam,
      };
    });
  }, [matchups, teamCards]);
  const [possibleGames, setPossibleGames] = useState<IMatchup[]>(
    managePossibleGames()
  );
  useEffect(() => setPossibleGames(managePossibleGames()), [
    managePossibleGames,
  ]);

  const updatedFields = mapUnusedFields(fields, tableGames, filterValues);

  const onGameUpdate = (game: IGame) => {
    const foundBracketGame = bracketGames?.find(
      item => item.id === game.bracketGameId
    );

    if (!foundBracketGame) return;

    const updatedBracketGame: IBracketGame = {
      ...foundBracketGame,
      awayTeamScore: game.awayTeamScore,
      homeTeamScore: game.homeTeamScore,
    };

    onBracketGameUpdate(updatedBracketGame);
  };

  const onFilterChange = (data: IScheduleFilter) => {
    const newData = mapFilterValues({ teamCards, pools }, data);
    changeFilterValues({ ...newData });
  };

  const toggleZooming = () => changeZoomingAction(!zoomingDisabled);

  const moveCard = (dropParams: IDropParams) => {
    const day = filterValues.selectedDay!;
    const isSimultaneousDnd = isFromMaker ? true : simultaneousDnd;
    const data = moveTeamCard(
      teamCards,
      tableGames,
      dropParams,
      isSimultaneousDnd,
      days?.length ? days[+day - 1] : undefined
    );

    const result: IMoveCardResult = {
      gameId: dropParams.gameId,
      teamCards: data.teamCards,
      possibleGame: dropParams.possibleGame,
    };

    switch (true) {
      case data.playoffSlot:
        return setMoveCardWarning(moveCardMessages.playoffSlot);
      case data.gameSlotInUse:
        return setMoveCardWarning(moveCardMessages.gameSlotInUse);
      case data.timeSlotInUse:
        return setMoveCardWarning(
          isSimultaneousDnd
            ? moveCardMessages.timeSlotInUseForGame
            : moveCardMessages.timeSlotInUseForTeam
        );
      case data.differentFacility: {
        setMoveCardWarning(moveCardMessages.differentFacility);
        return setMoveCardResult(result);
      }
      case data.divisionUnmatch: {
        setMoveCardWarning(moveCardMessages.divisionUnmatch);
        return setMoveCardResult(result);
      }
      case data.poolUnmatch: {
        setMoveCardWarning(moveCardMessages.poolUnmatch);
        return setMoveCardResult(result);
      }
      default:
        markGameAssigned(
          result.possibleGame,
          result.gameId,
          !dropParams.gameId && !dropParams.originGameId,
          !!(dropParams.gameId && dropParams.originGameId)
        );
        onTeamCardsUpdate(result.teamCards);
    }
  };

  const resetMoveCardWarning = () => {
    setMoveCardResult(undefined);
    setMoveCardWarning(undefined);
  };

  const confirmReplacement = () => {
    if (moveCardResult) {
      markGameAssigned(moveCardResult.possibleGame, moveCardResult.gameId);
      onTeamCardsUpdate(moveCardResult.teamCards);
      resetMoveCardWarning();
    }
  };

  const markGameAssigned = (
    game?: IMatchup | IGame,
    gameId?: number,
    doPreventAssign: boolean = false,
    doPreventUnassign: boolean = false
  ) => {
    if (!game) {
      return;
    }

    const isMatchup = typeof game.id === 'string';
    if (isMatchup) {
      const matchup = game as IMatchup;
      const foundGame = tableGames.find(g => g.id === gameId);
      if (foundGame) {
        if (!!matchup.assignedGameId) {
          if (!doPreventUnassign) {
            onUnassignMatchup(matchup);
          }
        } else {
          if (!doPreventAssign) {
            onAssignMatchup(matchup.id, foundGame.id);
          }
        }
      }
    }

    const gameSlot = game as IGame;
    if (gameSlot) {
      const foundMathup = matchups.find(
        g =>
          g.homeTeamId === gameSlot.homeTeam?.id &&
          g.awayTeamId === gameSlot.awayTeam?.id
      );
      if (foundMathup) {
        if (!!foundMathup.assignedGameId) {
          if (!doPreventUnassign) {
            onUnassignMatchup(foundMathup);
          }
        }
      }
    }
  };

  const onUnassignMatchup = (game: IMatchup) => {
    onAssignMatchup(game.id, null);
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

  const allTeamCardGames = getAllTeamCardGames(teamCards, games, days);

  const warnings =
    tableType === TableScheduleTypes.SCORES
      ? undefined
      : getScheduleWarning(scheduleData, event, teamCards, teamsDiagnostics!);

  const getTimeSlotsBySelectedDay = (): ITimeSlot[] => {
    let date = '';
    if (filterValues.selectedDay) {
      date = days[+filterValues.selectedDay - 1] || '';
    }

    if (schedulesDetails) {
      return getTimeSlotsFromEntities(
        schedulesDetails!.filter(v => v.game_date === date),
        TimeSlotsEntityTypes.SCHEDULE_DETAILS
      );
    }

    return timeSlots;
  };

  return (
    <section className={styles.section}>
      <h2 className="visually-hidden">Schedule table</h2>
      <div className={styles.scheduleTableWrapper}>
        {tableType === TableScheduleTypes.SCHEDULES && (
          <div className={styles.topAreaWrapper}>
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
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Zoom-n-Nav to navigate the schedule. Drag-n-Drop to move teams
              within games.
            </CardMessage>
            {teamsDiagnostics && divisionsDiagnostics && (
              <div className={styles.diagnosticsWrapper}>
                Diagnostics:
                <TeamsDiagnostics
                  teamsDiagnostics={teamsDiagnostics}
                  recalculateDiagnostics={recalculateDiagnostics}
                />
                <DivisionsDiagnostics
                  divisionsDiagnostics={divisionsDiagnostics}
                  recalculateDiagnostics={recalculateDiagnostics}
                />
              </div>
            )}
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
          {tableType === TableScheduleTypes.SCHEDULES && (
            <>
              {isFromMaker ? (
                <ListUnassignedMatchups
                  games={possibleGames}
                  event={event}
                  showHeatmap={showHeatmap}
                  onDrop={moveCard}
                />
              ) : (
                  <ListUnassignedTeams
                    pools={pools}
                    event={event}
                    tableType={tableType}
                    teamCards={teamCards}
                    minGamesNum={minGamesNum}
                    showHeatmap={showHeatmap}
                    onDrop={moveCard}
                  />
                )}
            </>
          )}
          <div className={styles.tableWrapper}>
            <div className={styles.headerWrapper}>
              <Filter
                tableType={tableType}
                warnings={warnings}
                days={days.length}
                filterValues={filterValues}
                onChangeFilterValue={onFilterChange}
                simultaneousDnd={isFromMaker ? undefined : simultaneousDnd}
                toggleSimultaneousDnd={toggleSimultaneousDnd}
              />
              {tableType === TableScheduleTypes.SCHEDULES &&
                schedulesDetails &&
                updateSchedulesDetails && (
                  <PopupAdvancedWorkflow
                    divisions={divisions}
                    teams={teamCards as ITeam[]}
                    timeValues={timeValues}
                    onScheduleGameUpdate={onScheduleGameUpdate}
                    schedulesDetails={schedulesDetails}
                    updateSchedulesDetails={updateSchedulesDetails}
                  />
                )}
            </div>

            <MatrixTable
              tableType={tableType}
              eventDay={filterValues.selectedDay!}
              games={tableGames}
              fields={updatedFields}
              timeSlots={getTimeSlotsBySelectedDay()!}
              facilities={facilities}
              showHeatmap={showHeatmap}
              isEnterScores={isEnterScores}
              moveCard={moveCard}
              disableZooming={zoomingDisabled}
              onTeamCardUpdate={onTeamCardUpdate}
              onTeamCardsUpdate={onTeamCardsUpdate}
              teamCards={teamCards}
              isFullScreen={isFullScreen}
              simultaneousDnd={simultaneousDnd}
              onToggleFullScreen={onToggleFullScreen}
              onGameUpdate={onGameUpdate}
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
              games={allTeamCardGames}
              fields={updatedFields}
              timeSlots={timeSlots}
              facilities={facilities}
              schedule={scheduleData}
              eventDays={days}
              isOpen={isPopupSaveReportOpen}
              teamCards={teamCards}
              onClose={togglePopupSaveReport}
            />
          </>
        )}
        <PopupConfirm
          type="warning"
          showYes={!!moveCardResult}
          isOpen={!!moveCardWarning}
          message={moveCardWarning || ''}
          onClose={resetMoveCardWarning}
          onCanceClick={resetMoveCardWarning}
          onYesClick={confirmReplacement}
        />
      </>
    </section>
  );
};

export default TableSchedule;
