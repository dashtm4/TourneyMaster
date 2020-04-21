import React, { useEffect, useState, Fragment } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { groupBy, keys } from 'lodash-es';
import BracketRound from './round';
import { IBracketSeed, IBracketGame } from '../bracketGames';
import BracketConnector from './connector';
import styles from './styles.module.scss';

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

  const getRoundTitle = (grid: string, round: string, gamesLength: number) => {
    if (grid !== '1') return;
    if (
      grids![grid][round]?.length <
      grids![grid][Number(round) + 1]?.length * 2
    ) {
      return '';
    }

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

  const [grids, setNewGrids] = useState<
    { [key: string]: { [key: string]: IBracketGame[] } } | undefined
  >(undefined);

  const [playInRound, setPlayInRound] = useState<
    { [key: string]: IBracketGame[] } | undefined
  >();

  const [hidden, setHidden] = useState<any>();

  useEffect(() => {
    const grids = groupBy(games, 'gridNum');
    console.log('grids', JSON.parse(JSON.stringify(grids)), hidden);

    let newGrids = {};
    keys(grids).forEach(key => (newGrids[key] = groupBy(grids[key], 'round')));

    console.log('newGrids', JSON.parse(JSON.stringify(newGrids)));

    if (newGrids[1][1].length < newGrids[1][2].length) {
      setPlayInRound({
        1: setInPlayGames(newGrids[1][1], newGrids[1][2]),
      });
      delete newGrids[1][1];
    }

    setNewGrids(newGrids);
  }, [games]);

  useEffect(() => {
    if (playInRound) {
      console.log('playInRound', JSON.parse(JSON.stringify(playInRound)));
      const hiddenConnectors = setHiddenConnectors(playInRound[1]);
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
          {grids &&
            keys(grids).map(gridKey => (
              <div key={`${gridKey}-grid`} className={styles.bracketContainer}>
                {gridKey === '1' &&
                  keys(playInRound)?.map(roundKey => (
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
                {keys(grids[gridKey]).map(roundKey => (
                  <Fragment key={`${roundKey}-playInRound`}>
                    <BracketRound
                      games={grids[gridKey][roundKey]}
                      onDrop={() => {}}
                      title={getRoundTitle(
                        gridKey,
                        roundKey,
                        grids[gridKey][roundKey].length
                      )}
                    />
                    <BracketConnector
                      hidden={
                        grids[gridKey][roundKey].some(v => v.hidden)
                          ? setHiddenConnectors(grids[gridKey][roundKey])
                          : undefined
                      }
                      step={grids[gridKey][roundKey]?.length}
                    />
                  </Fragment>
                ))}
              </div>
            ))}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
