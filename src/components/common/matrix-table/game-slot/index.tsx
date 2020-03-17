import React from 'react';
import { IField } from 'common/models/schedule/fields';
import TeamDrop, { DropParams } from '../dnd/drop';
import styles from '../styles.module.scss';
import { IGame } from '../helper';

interface IProps {
  game: IGame;
  field?: IField;
  isHeatmap: boolean;
  isEnterScores?: boolean;
  moveCard: (params: DropParams) => void;
}

const RenderGameSlot = (props: IProps) => {
  const { game, moveCard, field, isHeatmap, isEnterScores } = props;

  return (
    <td
      key={game.id}
      style={{ background: field?.isUnused ? '#e2e2e2' : 'transparent' }}
    >
      <div className={styles.gameSlot}>
        <TeamDrop
          accept="teamdrop"
          team={game.awayTeam!}
          fieldId={game.fieldId}
          teamPosition={1}
          timeSlotId={game.timeSlotId}
          onDrop={moveCard}
          isHeatmap={isHeatmap}
          isEnterScores={isEnterScores}
        />
        <TeamDrop
          accept="teamdrop"
          team={game.homeTeam!}
          fieldId={game.fieldId}
          teamPosition={2}
          timeSlotId={game.timeSlotId}
          onDrop={moveCard}
          isHeatmap={isHeatmap}
          isEnterScores={isEnterScores}
        />
      </div>
    </td>
  );
};

export default RenderGameSlot;
