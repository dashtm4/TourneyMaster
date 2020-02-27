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

  return (
    <tr key={timeSlot.id} className={styles.timeSlotRow}>
      <th>{timeSlot.time}</th>
      {games.map((game: IGame) => (
        <RenderGameSlot key={game.id} game={game} moveCard={moveCard} />
      ))}
    </tr>
  );
};

export default RenderTimeSlot;
