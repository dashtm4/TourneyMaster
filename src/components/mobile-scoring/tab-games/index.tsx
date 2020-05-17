import React from 'react';
import { ISchedulesGame, BindingCbWithOne } from 'common/models';
import ItemGame from '../item-game';
import styles from './styles.module.scss';
import { IMobileScoringGame } from '../common';

interface Props {
  gamesWithName: IMobileScoringGame[];
  originGames: ISchedulesGame[];
  changeGameWithName: BindingCbWithOne<IMobileScoringGame>;
}

const TabGame = ({ gamesWithName, originGames, changeGameWithName }: Props) => {
  const sortedTeamWithNames = gamesWithName.sort(
    (a, b) =>
      (a.facilityName || '').localeCompare(b.facilityName || '', undefined, {
        numeric: true,
      }) || a.fieldName.localeCompare(b.fieldName, undefined, { numeric: true })
  );

  return (
    <ul className={styles.teamList}>
      {!sortedTeamWithNames || sortedTeamWithNames.length === 0 ? (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {'All Games Within This Timeslot Have Scores'}
        </span>
      ) : null}
      {sortedTeamWithNames.map(gameWithName => (
        <ItemGame
          gameWithNames={gameWithName}
          originGame={
            originGames.find(
              originGame => originGame.game_id === gameWithName.id
            )!
          }
          changeGameWithName={changeGameWithName}
          key={gameWithName.id}
        />
      ))}
    </ul>
  );
};

export default TabGame;
