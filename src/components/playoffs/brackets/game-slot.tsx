import React from 'react';
import moment from 'moment';
import styles from './styles.module.scss';
import SeedDrop from '../dnd/drop';
import Seed from '../dnd/seed';
import { IBracketGame } from '../bracketGames';
import { formatTimeSlot } from 'helpers';

interface IProps {
  game: IBracketGame;
  onDrop: any;
  seedRound?: boolean;
}

const BracketGameSlot = (props: IProps) => {
  const { game, onDrop, seedRound } = props;
  const time = formatTimeSlot(game?.startTime || '');
  const date = moment(game?.gameDate).format('MM/DD/YYYY');

  return (
    <div
      key={game?.index}
      className={`${styles.bracketGame} ${game?.hidden && styles.hidden}`}
    >
      <SeedDrop
        id={game?.index}
        position={1}
        type="seed"
        onDrop={onDrop}
        placeholder={!seedRound ? game?.awayDisplayName : ''}
      >
        {game?.awaySeedId ? (
          <Seed
            id={game?.awaySeedId}
            name={String(game?.awaySeedId)}
            type="seed"
            dropped={true}
          />
        ) : (
          undefined
        )}
      </SeedDrop>
      <div className={styles.bracketGameDescription}>
        <span>{`Game ${game?.index}:  ${game?.fieldName}`}</span>
        <span>{`${time}, ${date}`}</span>
      </div>
      <SeedDrop
        id={game?.index}
        position={2}
        type="seed"
        onDrop={onDrop}
        placeholder={!seedRound ? game?.homeDisplayName : ''}
      >
        {game?.homeSeedId ? (
          <Seed
            id={game?.homeSeedId}
            name={String(game?.homeSeedId)}
            type="seed"
            dropped={true}
          />
        ) : (
          undefined
        )}
      </SeedDrop>
    </div>
  );
};

export default BracketGameSlot;
