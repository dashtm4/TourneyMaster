import React from 'react';
import { BracketGenerator } from 'react-tournament-bracket';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './styles.module.scss';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.3,
  limitToWrapper: true,
};

const Brackets = () => {
  const game = {
    id: '1',
    name: 'Game 1',
    bracketLabel: 'Field 1, Main Stadium',
    scheduled: 1585826080000,
    sides: {
      home: {
        score: { score: 1 },
        team: {
          id: '1',
          name: 'Seed 1',
        },
      },
      visitor: {
        score: { score: 2 },
        team: {
          id: '2',
          name: 'Seed 2',
        },
      },
    },
  };

  const game2 = {
    id: '2',
    name: 'Game 2',
    bracketLabel: 'Field 2, Main Stadium',
    scheduled: 1585826080000,
    sides: {
      home: {
        score: { score: 1 },
        team: {
          id: '3',
          name: 'Seed 3',
        },
      },
      visitor: {
        score: { score: 2 },
        team: {
          id: '4',
          name: 'Seed 4',
        },
      },
    },
  };

  const game3 = {
    id: '3',
    name: 'Game 3',
    bracketLabel: 'Field 3, Main Stadium',
    scheduled: 1585826080000,
    sides: {
      home: {
        score: { score: 2 },
        team: {
          id: '5',
          name: 'Seed 5',
        },
      },
      visitor: {
        score: { score: 1 },
        team: {
          id: '6',
          name: 'Seed 6',
        },
      },
    },
  };

  const game4 = {
    id: '4',
    name: 'Game 4',
    bracketLabel: 'Field 4, Main Stadium',
    scheduled: 1585826080000,
    sides: {
      home: {
        score: { score: 1 },
        team: {
          id: '7',
          name: 'Seed 7',
        },
      },
      visitor: {
        score: { score: 2 },
        team: {
          id: '8',
          name: 'Seed 8',
        },
      },
    },
  };

  //
  const resultOneTwo = {
    id: '5',
    name: 'Game 5',
    bracketLabel: 'Field 1, Main Stadium',
    scheduled: 1585988880000,
    sides: {
      home: {
        seed: {
          displayName: 'Winner Game 1',
          rank: 1,
          sourcePool: {},
          sourceGame: game,
        },
      },
      visitor: {
        seed: {
          displayName: 'Winner Game 2',
          rank: 1,
          sourcePool: {},
          sourceGame: game2,
        },
      },
    },
  };
  const resultThreeFour = {
    id: '6',
    name: 'Game 6',
    bracketLabel: 'Field 2, Main Stadium',
    scheduled: 1585988880000,
    sides: {
      home: {
        seed: {
          displayName: 'Winner Game 3',
          rank: 1,
          sourcePool: {},
          sourceGame: game3,
        },
      },
      visitor: {
        seed: {
          displayName: 'Winner Game 4',
          rank: 1,
          sourcePool: {},
          sourceGame: game4,
        },
      },
    },
  };

  const games = [
    {
      id: '7',
      name: 'Championship',
      bracketLabel: 'Field 1, Main Stadium',
      scheduled: 1586999999000,
      sides: {
        home: {
          seed: {
            displayName: 'Winner Game 5',
            rank: 1,
            sourcePool: {},
            sourceGame: resultOneTwo,
          },
        },
        visitor: {
          seed: {
            displayName: 'Winner Game 6',
            rank: 1,
            sourcePool: {},
            sourceGame: resultThreeFour,
          },
        },
      },
    },
  ];

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
            <BracketGenerator games={games} />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
