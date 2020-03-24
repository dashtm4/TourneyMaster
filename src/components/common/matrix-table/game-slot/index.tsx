import React from 'react';
import DropContainer, { IDropParams } from '../dnd/drop';
import TeamDragCard from '../dnd/drag';
import styles from '../styles.module.scss';
import { IGame } from '../helper';

interface Props {
  game: IGame;
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
}

const RenderGameSlot = (props: Props) => {
  const { game, onDrop, showHeatmap } = props;
  const { awayTeam, homeTeam } = game;
  const acceptType = 'teamdrop';

  return (
    <td className={styles.gameSlotContainer}>
      <div className={styles.gameSlot}>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={1}
          onDrop={onDrop}
        >
          {awayTeam && (
            <TeamDragCard
              type={acceptType}
              originGameId={game.id}
              showHeatmap={showHeatmap}
              teamCard={awayTeam}
            />
          )}
        </DropContainer>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={2}
          onDrop={onDrop}
        >
          {homeTeam && (
            <TeamDragCard
              type={acceptType}
              originGameId={game.id}
              showHeatmap={showHeatmap}
              teamCard={homeTeam}
            />
          )}
        </DropContainer>
      </div>
    </td>
  );
};

export default RenderGameSlot;
