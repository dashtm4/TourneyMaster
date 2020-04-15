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
      return 'In-Play Games';

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

  const [inPlayRound, setInPlayRound] = useState<
    { [key: string]: IBracketGame[] } | undefined
  >();

  const [hidden, setHidden] = useState<any>();

  useEffect(() => {
    const gameRounds = groupBy(games, 'round');

    if (gameRounds[0]?.length < gameRounds[1]?.length * 2) {
      setInPlayRound({ 0: setInPlayGames(gameRounds[0], gameRounds[1]) });
      delete gameRounds[0];
      setGameRounds(gameRounds);
      return;
    }

    setGameRounds(gameRounds);
  }, [games]);

  useEffect(() => {
    const hiddenConnectors = setHiddenConnectors();
    setHidden(hiddenConnectors);
  }, [inPlayRound]);

  const setHiddenConnectors = () => {
    if (!inPlayRound) return;
    const round = inPlayRound[0];
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
            {keys(inPlayRound)?.map(roundKey => (
              <>
                <BracketRound
                  games={inPlayRound![roundKey]}
                  onDrop={() => {}}
                  title="In-Play"
                />
                <BracketConnector
                  hidden={hidden}
                  step={inPlayRound![roundKey]?.length}
                />
              </>
            ))}
            {keys(gameRounds).map((roundKey, index) => (
              <Fragment key={index}>
                <BracketRound
                  games={gameRounds![roundKey]}
                  onDrop={() => {}}
                  title={getRoundTitle(
                    Number(roundKey),
                    gameRounds![roundKey]?.length
                  )}
                />
                <BracketConnector step={gameRounds![roundKey]?.length} />
              </Fragment>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
