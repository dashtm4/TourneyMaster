import React from 'react';
import styles from './styles.module.scss';
import BracketGameSlot from './game-slot';
import { IBracketGame } from '.';

interface IProps {
  games: IBracketGame[];
  onDrop: any;
  title: any;
  seedRound?: boolean;
}

const BracketRound = (props: IProps) => {
  const { games, onDrop, title, seedRound } = props;

  return (
    <div className={styles.bracketRound}>
      <span className={styles.roundTitle}>{title}</span>
      {games.map(game => (
        <BracketGameSlot
          key={`${game.id}-round`}
          seedRound={seedRound}
          game={game}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

export default BracketRound;
