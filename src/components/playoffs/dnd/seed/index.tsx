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
}

const Seed = (props: IProps) => {
  const { seedId, teamId, type, dropped, teamName } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { seedId, teamId, type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.8 : 1 }}
      className={`${styles.container} ${dropped ? styles.dropped : ''}`}
    >
      {teamId && teamName ? teamName : `Seed ${seedId}`}
    </div>
  );
};

export default Seed;
