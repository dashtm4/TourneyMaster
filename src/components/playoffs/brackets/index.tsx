import React, { useState, useEffect, Fragment } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { findIndex } from 'lodash-es';
import styles from './styles.module.scss';
import { IBracketDrop } from '../dnd/drop';
import BracketRound from './round';
import BracketConnector from './connector';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.3,
  limitToWrapper: true,
};

interface IBracketTeam {
  id: number | string;
  name: string;
}

export interface IBracketGame {
  id: number;
  awayDisplayName?: string;
  homeDisplayName?: string;
  away?: IBracketTeam;
  home?: IBracketTeam;
}

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
  const [oddSeeds, setOddSeeds] = useState<any[]>();

  const truncateSeeds = () => {
    const allowed = [2, 4, 8, 16];
    const seedsLength = seeds.length;
    let point = seedsLength;

    if (allowed.includes(seedsLength)) {
      setOddSeeds(undefined);
      return seeds;
    }
    if (seedsLength < 4 && seedsLength > 2) point = 2;
    if (seedsLength < 8 && seedsLength > 4) point = 4;
    if (seedsLength < 16 && seedsLength > 8) point = 8;

    const { localSeeds, leftOvers } = calculateLeftovers(seeds, point);

    setOddSeeds(leftOvers);
    return localSeeds;
  };

  useEffect(
    function allocate(lastGames?: any[]) {
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
        awayDisplayName: 'Game Winner',
        homeDisplayName: 'Game Winner',
      }));

      localGames.push(newGames);
      allocate(localGames);
    },
    [seeds]
  );

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

  const makeOddGames = (seeds?: any[]) => {
    return seeds
      ? [...Array(Math.round(seeds.length))].map((_, i) => ({
          id: i + 100 + 1,
        }))
      : [];
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
            {oddSeeds?.length && (
              <>
                <BracketRound
                  seedRound={true}
                  games={makeOddGames(oddSeeds)}
                  onDrop={onDrop}
                  title=""
                />
                <BracketConnector step={2} />
              </>
            )}
            {games?.map((round, index) => (
              <Fragment key={index}>
                <BracketRound
                  seedRound={index === 0}
                  key={index}
                  games={round}
                  onDrop={onDrop}
                  title={getRoundTitle(round.length)}
                />
                {round.length % 2 === 0 ? (
                  <BracketConnector step={round.length} />
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
