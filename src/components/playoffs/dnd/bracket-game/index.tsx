import React from 'react';
import { useDrag } from 'react-dnd';
import {
  IGame,
  getContrastingColor,
} from 'components/common/matrix-table/helper';
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
    awayDependsUpon,
    homeDependsUpon,
    divisionHex,
  } = game;

  const [{ isDragging }, drag] = useDrag({
    item: { id, divisionId, playoffIndex, type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDisplayName = (round?: number, depends?: number) => {
    if (!round || !depends) return;
    const key = round >= 0 ? 'WG' : 'LG';
    return `${key}${depends}`;
  };

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.8 : 1, background: `#${divisionHex}` }}
      className={styles.container}
    >
      <span style={{ color: getContrastingColor(divisionHex) }}>
        {divisionName}&nbsp;G{playoffIndex}
        <i>:</i>&nbsp;R{(playoffRound || 0) + 1}
        <i>,</i>&nbsp;
        {awaySeedId
          ? `S${awaySeedId}`
          : handleDisplayName(playoffRound, awayDependsUpon)}
        <i>:</i>
        {homeSeedId
          ? `S${homeSeedId}`
          : handleDisplayName(playoffRound, homeDependsUpon)}
      </span>
    </div>
  );
};

export default BracketGameCard;