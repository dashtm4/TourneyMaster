import React from 'react';
import { useDrag } from 'react-dnd';
import { IGame } from 'components/common/matrix-table/helper';
import styles from './styles.module.scss';

interface IProps {
  type: string;
  game: IGame;
  dropped?: boolean;
}

const BracketGameCard = (props: IProps) => {
  const { type, game } = props;
  const {
    id,
    playoffRound,
    playoffIndex,
    divisionId,
    divisionName,
    awaySeedId,
    homeSeedId,
    awayDisplayName,
    homeDisplayName,
    divisionHex,
  } = game;

  const [{ isDragging }, drag] = useDrag({
    item: { id, divisionId, playoffIndex, type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDisplayName = (displayName?: string) => {
    if (!displayName) return displayName;
    const splitText = displayName.split(' ');
    const isWinner = splitText.map(v => v.toLowerCase()).includes('winner');
    if (isWinner) {
      const winnerGame = splitText.find(v => Number(v));
      return `W${winnerGame}`;
    }
  };

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.8 : 1, background: `#${divisionHex}` }}
      className={styles.container}
    >
      <span>
        {divisionName}&nbsp;G{playoffIndex}
        <i>:</i>&nbsp;R{(playoffRound || 0) + 1}
        <i>,</i>&nbsp;
        {awaySeedId ? `S${awaySeedId}` : handleDisplayName(awayDisplayName)}
        <i>:</i>
        {homeSeedId ? `S${homeSeedId}` : handleDisplayName(homeDisplayName)}
      </span>
    </div>
  );
};

export default BracketGameCard;
