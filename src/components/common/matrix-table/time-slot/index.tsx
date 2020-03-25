import React from 'react';
import styles from '../styles.module.scss';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from '../helper';
import RenderGameSlot from '../game-slot';
import { IDropParams } from '../dnd/drop';
import { IField } from 'common/models/schedule/fields';
import { formatTimeSlot } from 'helpers';
import { ITeamCard } from 'common/models/schedule/teams';

interface IProps {
  timeSlot: ITimeSlot;
  games: IGame[];
  fields: IField[];
  showHeatmap?: boolean;
  isEnterScores?: boolean;
  moveCard: (params: IDropParams) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
}

const RenderTimeSlot = (props: IProps) => {
  const {
    timeSlot,
    games,
    moveCard,
    fields,
    showHeatmap,
    onTeamCardUpdate,
  } = props;

  return (
    <tr key={timeSlot.id} className={styles.timeSlotRow}>
      <th>{formatTimeSlot(timeSlot.time)}</th>
      {games
        .filter(
          game => !fields.find(field => field.id === game.fieldId)?.isUnused
        )
        .map((game: IGame) => (
          <RenderGameSlot
            key={game.id}
            game={game}
            onDrop={moveCard}
            showHeatmap={showHeatmap}
            onTeamCardUpdate={onTeamCardUpdate}
          />
        ))}
    </tr>
  );
};

export default RenderTimeSlot;
