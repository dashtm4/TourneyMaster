import React from 'react';
import styles from '../styles.module.scss';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from '../helper';
import RenderGameSlot from '../game-slot';
import { DropParams } from '../dnd/drop';
import { IField } from 'common/models/schedule/fields';
import moment from 'moment';

interface IProps {
  timeSlot: ITimeSlot;
  games: IGame[];
  fields: IField[];
  isHeatmap: boolean;
  isEnterScores?: boolean;
  moveCard: (params: DropParams) => void;
}

const RenderTimeSlot = (props: IProps) => {
  const { timeSlot, games, moveCard, fields, isHeatmap, isEnterScores } = props;

  const formatTimeSlot = (time: string) => {
    if (!time || typeof time !== 'string') return;
    const timeValue = time.slice(0, 5);
    return moment(timeValue, ['HH:mm']).format('hh:mm A');
  };

  const findFielForGameSlot = (game: IGame) => {
    return fields.find(field => field.id === game.fieldId);
  };

  return (
    <tr key={timeSlot.id} className={styles.timeSlotRow}>
      <th>{formatTimeSlot(timeSlot.time)}</th>
      {games.map((game: IGame) => (
        <RenderGameSlot
          key={game.id}
          game={game}
          isHeatmap={isHeatmap}
          isEnterScores={isEnterScores}
          field={findFielForGameSlot(game)}
          moveCard={moveCard}
        />
      ))}
    </tr>
  );
};

export default RenderTimeSlot;
