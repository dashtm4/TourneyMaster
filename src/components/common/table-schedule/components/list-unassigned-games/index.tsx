import React, { useState } from 'react';
import styles from './styles.module.scss';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';
import { IEventDetails } from 'common/models';
import GameDragCard from './dnd/game-drag';
import { Radio } from 'components/common';
import { IMatchup } from 'components/visual-games-maker/helpers';

interface IProps {
  event: IEventDetails;
  games: IMatchup[];
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
}

enum DisplayType {
  UNASSIGNED_GAMES = 'Unassigned games',
  ALL_GAMES = 'All games',
}

const UnassignedGamesList = (props: IProps) => {
  const { games, onDrop, showHeatmap } = props;
  const acceptType = 'teamdrop';
  const [displayType, setDisplayType] = useState(DisplayType.UNASSIGNED_GAMES);

  const assignedGames = games.filter(g => !!g.assignedGameId);

  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: any) => {
      onDrop({
        gameId: undefined,
        position: undefined,
        teamId: item.id,
        possibleGame: item.possibleGame,
        originGameId: item.originGameId,
        originGameDate: item.originGameDate,
      });
    },
  });

  const onGamesListDisplayTypeChange = (e: any) => setDisplayType(e.nativeEvent.target.value);

  const renderGames = (items: IMatchup[]) => (
    <>
      {items.map(game => (
        <tr key={`tr-${game.awayTeamId}-${game.homeTeamId}`}>
          <td>
            <GameDragCard
              showHeatmap={showHeatmap}
              game={game}
              type={acceptType}
            />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div
      className={styles.container}
      style={{ background: isOver ? '#fcfcfc' : '#ececec' }}
    >
      <h3 className={styles.title}>Needs Assignment</h3>
      <div className={styles.checkboxWrapper}>
        <Radio
          options={Object.values(DisplayType)}
          checked={displayType}
          onChange={onGamesListDisplayTypeChange}
          row={true}
        />
      </div>
      <div ref={drop} className={styles.dropArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Games</th>
            </tr>
          </thead>
          <tbody>
            {renderGames(games.filter(g => !g.assignedGameId))}
            {!!(
              displayType === DisplayType.ALL_GAMES &&
              assignedGames.length > 0
            ) && (
                <>
                  <tr className={styles.emptyRow}>
                    <td>Assigned Games</td>
                  </tr>
                  {renderGames(assignedGames)}
                </>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnassignedGamesList;
