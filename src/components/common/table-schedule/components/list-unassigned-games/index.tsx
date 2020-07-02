import React, { useState } from 'react';
import styles from './styles.module.scss';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';
import { IEventDetails } from 'common/models';
import { IConfigurableGame } from 'components/common/matrix-table/helper';
import GameDragCard from './dnd/game-drag';
import { Radio } from 'components/common';
import { GamesListDisplayType } from './enums';

interface IProps {
  event: IEventDetails;
  games: IConfigurableGame[];
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedGamesList = (props: IProps) => {
  const { games, onDrop, showHeatmap } = props;
  const acceptType = 'teamdrop';
  const [gamesListDisplayType, setGamesListDisplayType] = useState(GamesListDisplayType.UNASSIGNED_GAMES);

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

  const onGamesListDisplayTypeChange = (e: any) => setGamesListDisplayType(e.nativeEvent.target.value);

  const renderGames = (items: IConfigurableGame[]) => (
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
          options={Object.values(GamesListDisplayType)}
          checked={gamesListDisplayType}
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
            {renderGames(games.filter(g => !g.isAssigned))}
            {!!(
              gamesListDisplayType === GamesListDisplayType.ALL_GAMES &&
              games.some(g => g.isAssigned)
            ) && (
                <>
                  <tr className={styles.emptyRow}>
                    <td>Assigned Games</td>
                  </tr>
                  {renderGames(games.filter(g => g.isAssigned))}
                </>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnassignedGamesList;