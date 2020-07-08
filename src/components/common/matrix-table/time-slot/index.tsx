import React from 'react';
import styles from '../styles.module.scss';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from '../helper';
import RenderGameSlot from '../game-slot';
import { IDropParams } from '../dnd/drop';
import { IField } from 'common/models/schedule/fields';
import { formatTimeSlot } from 'helpers';
import { ITeamCard } from 'common/models/schedule/teams';
import { Icons, TableScheduleTypes } from 'common/enums';
import { getIcon } from 'helpers';

interface IProps {
  tableType: TableScheduleTypes;
  timeSlot: ITimeSlot;
  games: IGame[];
  fields: IField[];
  showHeatmap?: boolean;
  isEnterScores?: boolean;
  moveCard: (params: IDropParams) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  teamCards: ITeamCard[];
  onTeamCardsUpdate: (teamCards: ITeamCard[]) => void;
  isDndMode: boolean;
  simultaneousDnd?: boolean;
  highlightedGamedId?: number;
  onGameUpdate: (game: IGame) => void;
}

const RenderTimeSlot = (props: IProps) => {
  const {
    tableType,
    timeSlot,
    games,
    moveCard,
    fields,
    showHeatmap,
    onTeamCardUpdate,
    teamCards,
    onTeamCardsUpdate,
    isDndMode,
    isEnterScores,
    highlightedGamedId,
    onGameUpdate,
    simultaneousDnd,
  } = props;

  const idsGamesForTimeSlot = games
    .filter(game => game.timeSlotId === timeSlot.id)
    .map(game => game.id);

  const currentDate = games.find(item => item.gameDate)?.gameDate;

  const filterByDayAndField = (g: any) => {
    return idsGamesForTimeSlot.includes(g.id) && currentDate === g.date;
  };

  const anyTeamsInFieldUnlocked = teamCards.some((t) =>
    t.games?.filter(filterByDayAndField).some((game) => !game.isTeamLocked)
  );

  const noTeamsInField = !teamCards.some((t) =>
    t.games?.some(filterByDayAndField)
  );

  const isTimeSlotLocked = !(anyTeamsInFieldUnlocked || noTeamsInField);

  const onLockClick = () => {
    const updatedTeamCards = teamCards.map(teamCard => ({
      ...teamCard,
      games: teamCard.games?.map(item =>
        idsGamesForTimeSlot.includes(item.id) && currentDate === item.date
          ? { ...item, isTeamLocked: !isTimeSlotLocked }
          : item
      ),
    }));
    onTeamCardsUpdate(updatedTeamCards);
  };

  return (
    <tr key={timeSlot.id} className={styles.timeSlotRow}>
      <th>
        <div className={styles.fieldNameContainer}>
          <div>{formatTimeSlot(timeSlot.time)}</div>
          {tableType === TableScheduleTypes.SCHEDULES && (
            <button className={styles.lockBtn} onClick={onLockClick}>
              {getIcon(
                isTimeSlotLocked ? Icons.LOCK : Icons.LOCK_OPEN,
                {
                  fill: '#00A3EA',
                }
              )}
              <span className="visually-hidden">Unlock/Lock teams</span>
            </button>
          )}
        </div>
      </th>
      {games
        .filter(
          game => !fields.find(field => field.id === game.fieldId)?.isUnused
        )
        .map((game: IGame) => (
          <RenderGameSlot
            tableType={tableType}
            key={game.id}
            game={game}
            onDrop={moveCard}
            showHeatmap={showHeatmap}
            onTeamCardUpdate={onTeamCardUpdate}
            isDndMode={isDndMode}
            isEnterScores={isEnterScores}
            teamCards={teamCards}
            highlightedGamedId={highlightedGamedId}
            simultaneousDnd={simultaneousDnd}
            onGameUpdate={onGameUpdate}
          />
        ))}
    </tr>
  );
};

export default RenderTimeSlot;
