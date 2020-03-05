import React from 'react';
import styles from '../styles.module.scss';
import { IGame } from '../helper';
import TeamDrop, { DropParams } from '../dnd/drop';

interface IProps {
  game: IGame;
  moveCard: (params: DropParams) => void;
}

const RenderGameSlot = (props: IProps) => {
  const { game, moveCard } = props;

  return (
    <td key={game.id}>
      <div className={styles.gameSlot}>
        <TeamDrop
          accept="teamdrop"
          text={game.awayTeam?.id!}
          fieldId={game.fieldId}
          teamPosition={1}
          timeSlotId={game.timeSlotId}
          onDrop={moveCard}
        />
        <TeamDrop
          accept="teamdrop"
          text={game.homeTeam?.id!}
          fieldId={game.fieldId}
          teamPosition={2}
          timeSlotId={game.timeSlotId}
          onDrop={moveCard}
        />
      </div>
    </td>
  );
};

export default RenderGameSlot;
