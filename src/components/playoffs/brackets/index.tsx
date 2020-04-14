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

  const getRoundTitle = (gamesLength: number) => {
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

  useEffect(() => {
    const gameRounds = groupBy(games, 'round');
    setGameRounds(gameRounds);
  }, [games]);

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
            {keys(gameRounds).map((roundKey, index) => (
              <Fragment key={index}>
                <BracketRound
                  games={gameRounds![roundKey]}
                  onDrop={() => {}}
                  title={getRoundTitle(gameRounds![roundKey]?.length)}
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
