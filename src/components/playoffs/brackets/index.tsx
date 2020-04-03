import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './styles.module.scss';
import SeedDrop, { IBracketDrop } from '../dnd/drop';
import Seed from '../dnd/seed';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.3,
  limitToWrapper: true,
};

interface IBracketTeam {
  id: number | string;
  name: string;
}

interface IBracketGame {
  id: number;
  awayDisplayName?: string;
  homeDisplayName?: string;
  away?: IBracketTeam;
  home?: IBracketTeam;
}

const selectStyleForConnector = (num: number) => {
  switch (num) {
    case 8:
      return styles.connectors8;
    case 4:
      return styles.connectors4;
    case 2:
      return styles.connectors2;
    default:
      return styles.connectors2;
  }
};

const Round = ({
  games,
  onDrop,
  title,
}: {
  games: IBracketGame[];
  onDrop: any;
  title: any;
  seedRound?: boolean;
}) => (
  <div className={styles.bracketRound}>
    <span className={styles.roundTitle}>{title}</span>
    {games.map(game => (
      <GameSlot game={game} onDrop={onDrop} />
    ))}
  </div>
);

const GameSlot = ({ game, onDrop }: { game: IBracketGame; onDrop: any }) => (
  <div key={game.id} className={styles.bracketGame}>
    <SeedDrop id={game.id} position={1} type="seed" onDrop={onDrop}>
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
    <SeedDrop id={game.id} position={2} type="seed" onDrop={onDrop}>
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

const Connector = ({ step }: { step: number }) => (
  <div className={selectStyleForConnector(step)}>
    {[...Array(step / 2)].map(() => (
      <div className={styles.connector} />
    ))}
  </div>
);

interface IProps {
  seeds: { id: number; name: string }[];
}

const Brackets = (props: IProps) => {
  const { seeds } = props;

  const games2 = [
    {
      id: 5,
      awayDisplayName: 'Winner Game 1',
      homeDisplayName: 'Winner Game 2',
    },
    {
      id: 6,
      awayDisplayName: 'Winner Game 3',
      homeDisplayName: 'Winner Game 4',
    },
  ];

  const games1 = [
    {
      id: 7,
      awayDisplayName: 'Winner Game 5',
      homeDisplayName: 'Winner Game 6',
    },
  ];

  const [games, setGames] = useState(
    [...Array(seeds.length / 2)].map((_v, i) => ({ id: i + 1 }))
  );

  const updateGames = (games: IBracketGame[], data: IBracketDrop) => {
    return games.map(game =>
      game.id === data.id
        ? {
            ...game,
            [data.position === 1 ? 'away' : 'home']: seeds.find(
              seed => seed.id === data.seedId
            ),
          }
        : game
    );
  };

  const onDrop = (data: IBracketDrop) => {
    setGames(games => updateGames(games, data));
  };

  return (
    <div className={styles.container}>
      <TransformWrapper
        defaultPositionX={1}
        defaultPositionY={1}
        defaultScale={1}
        options={{ ...TRANSFORM_WRAPPER_OPTIONS, disabled: false }}
      >
        <TransformComponent>
          <div className={styles.bracketContainer}>
            <Round
              games={games}
              seedRound={true}
              onDrop={onDrop}
              title="Elite Eight"
            />
            <Connector step={4} />
            <Round games={games2} onDrop={onDrop} title="Final Four" />
            <Connector step={2} />
            <Round games={games1} onDrop={onDrop} title="Championship" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
