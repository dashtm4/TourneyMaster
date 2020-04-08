import React from 'react';
import styles from './styles.module.scss';
import SeedDrop from '../dnd/drop';
import { IBracketGame } from './index';
import Seed from '../dnd/seed';

interface IProps {
  game: IBracketGame;
  onDrop: any;
  seedRound?: boolean;
}

const BracketGameSlot = (props: IProps) => {
  const { game, onDrop, seedRound } = props;

  return (
    <div key={game.id} className={styles.bracketGame}>
      <SeedDrop
        id={game.id}
        position={1}
        type="seed"
        onDrop={onDrop}
        placeholder={!seedRound ? game.awayDisplayName : ''}
      >
        {game.away ? (
          <Seed
            id={game.away.id!}
            name={game.away.name}
            type="seed"
            dropped={true}
          />
        ) : (
          undefined
        )}
      </SeedDrop>
      <div className={styles.bracketGameDescription}>
        <span>Game 1: Field 1, Main Stadium</span>
        <span>10:00 AM, 02/09/20</span>
      </div>
      <SeedDrop
        id={game.id}
        position={2}
        type="seed"
        onDrop={onDrop}
        placeholder={!seedRound ? game.homeDisplayName : ''}
      >
        {game.home ? (
          <Seed
            id={game.home.id!}
            name={game.home.name}
            type="seed"
            dropped={true}
          />
        ) : (
          undefined
        )}
      </SeedDrop>
    </div>
  );
};

export default BracketGameSlot;
