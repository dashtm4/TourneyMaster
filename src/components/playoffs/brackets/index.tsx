import React, { Fragment, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './styles.module.scss';
import BracketRound from './round';
import { IBracketSeed, IBracketGame } from '../bracketGames';
import { groupBy, keys } from 'lodash-es';
import BracketConnector from './connector';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.3,
  limitToWrapper: true,
};

interface IProps {
  seeds: IBracketSeed[];
  games: IBracketGame[];
}

const Brackets = (props: IProps) => {
  const { games } = props;

  const getRoundTitle = (round: number, gamesLength: number) => {
    if (gameRounds && gamesLength <= gameRounds[round + 1]?.length)
      return 'Play-In Games';

    switch (gamesLength) {
      case 8:
        return 'Sweet 16';
      case 4:
        return 'Elite Eight';
      case 2:
        return 'Final Four';
      case 1:
        return 'Championship';
    }
  };

  const [gameRounds, setGameRounds] = useState<
    { [key: string]: IBracketGame[] } | undefined
  >(undefined);

  const [playInRound, setPlayInRound] = useState<
    { [key: string]: IBracketGame[] } | undefined
  >();

  const [hidden, setHidden] = useState<any>();

  useEffect(() => {
    const gameRounds = groupBy(games, 'round');
    console.log('gameRounds', JSON.parse(JSON.stringify(gameRounds)));

    if (gameRounds[1]?.length < gameRounds[2]?.length * 2) {
      setPlayInRound({ 1: setInPlayGames(gameRounds[1], gameRounds[2]) });
      delete gameRounds[1];
      setGameRounds(gameRounds);
      return;
    }

    setGameRounds(gameRounds);
  }, [games]);

  useEffect(() => {
    if (playInRound) {
      const hiddenConnectors = setHiddenConnectors(playInRound[0]);
      setHidden(hiddenConnectors);
    }
  }, [playInRound]);

  const setHiddenConnectors = (round: any[]) => {
    if (!round) return;
    const arr = [];

    for (let i = 0; i < round?.length; i += 2) {
      arr.push({
        hiddenTop: round[i]?.hidden,
        hiddenBottom: round[i + 1]?.hidden,
      });
    }

    return arr;
  };

  const setInPlayGames = (games: IBracketGame[], nextGames: IBracketGame[]) => {
    const arr = [...Array(nextGames.length * 2)];
    const order = [1, 3, 5, 7, 6, 4, 2];
    order.forEach((v, i) => (arr[v] = games[i]));

    return arr.map((item, ind) => ({
      ...item,
      hidden: ind === 0 || !item,
    }));
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
            {keys(playInRound)?.map(roundKey => (
              <Fragment key={`${roundKey}-playInRound`}>
                <BracketRound
                  games={playInRound![roundKey]}
                  onDrop={() => {}}
                  title="Play-In Games"
                />
                <BracketConnector
                  hidden={hidden}
                  step={playInRound![roundKey]?.length}
                />
              </Fragment>
            ))}
            {keys(gameRounds)
              .filter(key => key !== '0')
              .map((roundKey, index) => (
                <Fragment key={`${index}-keyRound`}>
                  <BracketRound
                    games={gameRounds![roundKey]}
                    onDrop={() => {}}
                    title={getRoundTitle(
                      Number(roundKey),
                      gameRounds![roundKey]?.length
                    )}
                  />
                  <BracketConnector
                    hidden={
                      gameRounds![roundKey].some(v => v.hidden)
                        ? setHiddenConnectors(gameRounds![roundKey])
                        : undefined
                    }
                    step={gameRounds![roundKey]?.length}
                  />
                </Fragment>
              ))}
          </div>
          <div className={styles.bracketContainer}>
            {gameRounds &&
              keys(gameRounds)
                .filter(key => key === '0')
                .map(key => (
                  <BracketRound
                    key={key}
                    games={gameRounds[key]}
                    onDrop={() => {}}
                    title={'Single'}
                  />
                ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
