import React from 'react';
import { ISchedulesGameWithNames, ISchedulesGame } from 'common/models';
import ItemGame from '../item-game';
import styles from './styles.module.scss';

interface Props {
  gamesWithName: ISchedulesGameWithNames[];
  originGames: ISchedulesGame[];
}

const TabGame = ({ gamesWithName, originGames }: Props) => {
  const sortedTeamWithNames = gamesWithName.sort((a, b) =>
    a.fieldName.localeCompare(b.fieldName, undefined, { numeric: true })
  );

  return (
    <ul className={styles.teamList}>
      {sortedTeamWithNames.map(gameWithName => (
        <ItemGame
          gameWithNames={gameWithName}
          originGame={
            originGames.find(
              originGame => originGame.game_id === gameWithName.id
            )!
          }
          key={gameWithName.id}
        />
      ))}
    </ul>
  );
};

export default TabGame;