import React from 'react';
import styles from '../styles.module.scss';
import { ITimeSlot } from 'components/schedules';
import { IGame } from '../helper';
import RenderGameSlot from '../game-slot';
import { DropParams } from '../dnd/drop';

interface IProps {
  timeSlot: ITimeSlot;
  games: IGame[];
  moveCard: (params: DropParams) => void;
}

const RenderTimeSlot = (props: IProps) => {
  const { timeSlot, games, moveCard } = props;

  const formatTimeSlot = (time: string) => {
    if (!time) return;
    return time.slice(0, 5);
  };

  return (
    <tr key={timeSlot.id} className={styles.timeSlotRow}>
      <th>{formatTimeSlot(timeSlot.time)}</th>
      {games.map((game: IGame) => (
        <RenderGameSlot key={game.id} game={game} moveCard={moveCard} />
      ))}
    </tr>
  );
};

export default RenderTimeSlot;
