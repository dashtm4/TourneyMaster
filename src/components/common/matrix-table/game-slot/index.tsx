import React from 'react';
import DropContainer, { IDropParams } from '../dnd/drop';
import TeamDragCard from '../dnd/drag';
import styles from '../styles.module.scss';
import { IGame } from '../helper';
import { ITeamCard } from 'common/models/schedule/teams';

interface Props {
  game: IGame;
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
}

const RenderGameSlot = (props: Props) => {
  const { game, onDrop, showHeatmap, onTeamCardUpdate } = props;
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
              onTeamCardUpdate={onTeamCardUpdate}
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
              onTeamCardUpdate={onTeamCardUpdate}
            />
          )}
        </DropContainer>
      </div>
    </td>
  );
};

export default RenderGameSlot;
