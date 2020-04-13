/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { findIndex } from 'lodash-es';
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
  seedRound,
}: {
  games: IBracketGame[];
  onDrop: any;
  title: any;
  seedRound?: boolean;
}) => (
  <div className={styles.bracketRound}>
    <span className={styles.roundTitle}>{title}</span>
    {games.map(game => (
      <GameSlot
        key={`${game.id}-round`}
        seedRound={seedRound}
        game={game}
        onDrop={onDrop}
      />
    ))}
  </div>
);

const GameSlot = ({
  game,
  onDrop,
  seedRound,
}: {
  game: IBracketGame;
  onDrop: any;
  seedRound?: boolean;
}) => (
  <div key={game.id} className={styles.bracketGame}>
    <SeedDrop
      id={game.id}
      position={1}
      type="seed"
      usePlaceholder={!seedRound}
      onDrop={onDrop}
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
      usePlaceholder={!seedRound}
      onDrop={onDrop}
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

const Connector = ({ step }: { step: number }) => (
  <div className={selectStyleForConnector(step)}>
    {[...Array(Math.round(step / 2))].map(() => (
      <div key={Math.random()} className={styles.connector} />
    ))}
  </div>
);

const calculateLeftovers = (arr: any[], point: number) => {
  const localSeeds = [...arr].slice(0, point);
  const leftOvers = [...arr].slice(point, arr.length);

  return {
    localSeeds,
    leftOvers,
  };
};

interface IProps {
  seeds: { id: number; name: string }[];
}

const Brackets = (props: IProps) => {
  const { seeds } = props;

  const [games, setGames] = useState<IBracketGame[][]>();
  const [, setOddSeeds] = useState<any[]>();

  const truncateSeeds = () => {
    const allowed = [2, 4, 8, 16];
    const seedsLength = seeds.length;
    let point = seedsLength;

    if (allowed.includes(seedsLength)) return seeds;
    if (seedsLength < 4 && seedsLength > 2) point = 2;
    if (seedsLength < 8 && seedsLength > 4) point = 4;
    if (seedsLength < 16 && seedsLength > 8) point = 8;

    const { localSeeds, leftOvers } = calculateLeftovers(seeds, point);
    setOddSeeds(leftOvers);
    return localSeeds;
  };

  useEffect(function allocate(lastGames?: any[]) {
    const localSeeds = truncateSeeds();
    const localGames = lastGames || [];
    const thisIndex = localGames.flat().length;
    const thisLength = localGames?.length
      ? localGames[localGames.length - 1]?.length / 2
      : localSeeds.length / 2;

    if (thisLength < 1) {
      setGames(lastGames);
      return;
    }

    const newGames = [...Array(thisLength)].map((_, i) => ({
      id: i + thisIndex + 1,
    }));

    localGames.push(newGames);
    allocate(localGames);
  }, seeds);

  const updateGames = (gamesArr: IBracketGame[][], data: IBracketDrop) => {
    return gamesArr.map(_games => {
      if (findIndex(_games, { id: data.id }) >= 0) {
        return _games.map(_game =>
          _game.id === data.id
            ? {
                ..._game,
                [data.position === 1 ? 'away' : 'home']: seeds.find(
                  item => item.id === data.seedId
                ),
              }
            : _game
        );
      }
      return _games;
    });
  };

  const onDrop = (data: IBracketDrop) => {
    setGames(games => updateGames(games!, data));
  };

  const getRoundTitle = (gamesLength: number) => {
    switch (gamesLength) {
      case 4:
        return 'Elite Eight';
      case 2:
        return 'Final Four';
      case 1:
        return 'Championship';
    }
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
            {games?.map((round, index) => (
              <Fragment key={index}>
                <Round
                  seedRound={index === 0}
                  key={index}
                  games={round}
                  onDrop={onDrop}
                  title={getRoundTitle(round.length)}
                />
                {round.length % 2 === 0 ? (
                  <Connector step={round.length} />
                ) : null}
              </Fragment>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
