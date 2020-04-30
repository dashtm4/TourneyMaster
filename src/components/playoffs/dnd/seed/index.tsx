import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './styles.module.scss';

interface IProps {
  seedId?: number;
  name: string;
  type: string;
  dropped?: boolean;
  teamId?: string;
  teamName?: string;
  score?: number;
  isHighlighted: boolean;
  setHighlightedTeamId: (teamId: string) => void;
}

const Seed = (props: IProps) => {
  const {
    seedId,
    teamId,
    type,
    dropped,
    teamName,
    score,
    isHighlighted,
    setHighlightedTeamId,
  } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { seedId, teamId, type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      onMouseEnter={() => setHighlightedTeamId(teamId!)}
      onMouseLeave={() => setHighlightedTeamId('')}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`${styles.container} ${dropped ? styles.dropped : ''} ${
        isHighlighted ? styles.highlighted : ''
      }`}
    >
      <span className={styles.seedName}>
        {teamId && teamName ? teamName : `Seed ${seedId}`}
      </span>
      <p className={styles.scoreWrapper}>{score || ''}</p>
    </div>
  );
};

export default Seed;
